import React from 'react';

const LoadingBook = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div style={{
                width: '100px',
                height: '100px',
                perspective: '1000px',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    animation: 'flip 2s infinite linear',
                }}>
                    {/* Sampul depan */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#4A6572',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}>
                        BUKU
                    </div>
                    {/* Sampul belakang */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#344955',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}>
                        BUKU
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes flip {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingBook;
