<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fullstack Randika Assessment</title>

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Optional: konfigurasi dark mode -->
    <script>
      tailwind.config = {
        darkMode: 'class', // bisa 'media' atau 'class'
        theme: {
          extend: {},
        },
      }
    </script>

    <!-- Vite React -->
    @viteReactRefresh
    @vite('resources/js/main.jsx')
  </head>
  <body class="antialiased bg-gray-100 dark:bg-gray-900">
    <div id="app"></div>
  </body>
</html>
