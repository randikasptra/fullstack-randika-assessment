<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use App\Exceptions\OrderNotFoundException; // Asumsi custom exception, atau gunain ModelNotFound

class OrderController extends Controller
{
    private const PAGINATION_LIMIT = 50; // Scalability: Prevent overload

    /**
     * Get user's order list with pagination.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', self::PAGINATION_LIMIT);

            $orders = Order::with(['orderItems.book', 'shippingAddress'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $orders->items(), // Only items, meta separate if needed
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (AuthorizationException $e) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        } catch (\Exception $e) {
            // Log: \Log::error('Orders index error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch orders'], 500);
        }
    }

    /**
     * Get order detail.
     *
     * @param int $orderId
     * @return JsonResponse
     * @throws OrderNotFoundException
     */
    public function show(int $orderId): JsonResponse
    {
        try {
            $order = $this->getUserOrder($orderId, ['orderItems.book', 'shippingAddress', 'user']);

            return response()->json([
                'success' => true,
                'data' => $order,
            ]);
        } catch (OrderNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch order detail'], 500);
        }
    }

    /**
     * Cancel order (only for pending/processing, within time limit).
     *
     * @param int $orderId
     * @return JsonResponse
     */
    public function cancel(int $orderId): JsonResponse
    {
        try {
            $order = $this->validateCancellableOrder($orderId);

            DB::beginTransaction();
            try {
                // Restore stock
                foreach ($order->orderItems as $item) {
                    $item->book->increment('stock', $item->quantity);
                }

                $order->update(['status' => 'cancelled']);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order cancelled successfully',
                    'data' => $order->fresh(),
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to cancel order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete order (only for cancelled).
     *
     * @param int $orderId
     * @return JsonResponse
     */
    public function destroy(int $orderId): JsonResponse
    {
        try {
            $order = $this->getUserOrder($orderId);
            if ($order->status !== 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only cancelled orders can be deleted',
                ], 400);
            }

            DB::beginTransaction();
            try {
                $order->delete(); // Cascade deletes items/address if set in model

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order deleted successfully',
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete order'], 500);
        }
    }

    /**
     * Confirm order as completed (only for shipped).
     *
     * @param int $orderId
     * @return JsonResponse
     */
    public function confirmOrder(int $orderId): JsonResponse
    {
        try {
            $order = $this->validateConfirmableOrder($orderId);

            DB::beginTransaction();
            try {
                $order->update(['status' => 'completed']);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order confirmed as completed',
                    'data' => $order->fresh(),
                ]);
            } catch (\Exception $txE) {
                DB::rollBack();
                throw $txE;
            }
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to confirm order'], 500);
        }
    }

    /**
     * Get user's order with relations.
     *
     * @param int $orderId
     * @param array $relations
     * @return Order
     * @throws OrderNotFoundException
     */
    private function getUserOrder(int $orderId, array $relations = []): Order
    {
        $order = Order::with($relations)
            ->where('user_id', auth()->id())
            ->find($orderId);

        if (!$order) {
            throw new OrderNotFoundException('Order not found or access denied.');
        }

        return $order;
    }

    /**
     * Validate order for cancellation (pending/processing, within 24h).
     *
     * @param int $orderId
     * @return Order
     * @throws ValidationException
     */
    private function validateCancellableOrder(int $orderId): Order
    {
        $order = $this->getUserOrder($orderId);

        $validStatuses = ['pending', 'processing'];
        if (!in_array($order->status, $validStatuses)) {
            throw ValidationException::withMessages(['status' => 'Order cannot be cancelled in current status.']);
        }

        // Time limit: e.g., within 24 hours
        if ($order->created_at->diffInHours(now()) > 24) {
            throw ValidationException::withMessages(['time' => 'Cancellation window expired.']);
        }

        return $order;
    }

    /**
     * Validate order for confirmation (shipped only).
     *
     * @param int $orderId
     * @return Order
     * @throws ValidationException
     */
    private function validateConfirmableOrder(int $orderId): Order
    {
        $order = $this->getUserOrder($orderId);

        if ($order->status !== 'shipped') {
            throw ValidationException::withMessages(['status' => 'Order can only be confirmed if shipped.']);
        }

        return $order;
    }

    // Contoh Unit Test (tests/Feature/OrderControllerTest.php)
    // public function test_user_can_cancel_pending_order() { ... assert status 'cancelled'; }
}
