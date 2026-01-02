import React, { useEffect, useRef, useState, useMemo } from 'react';

const ParticlesBg = ({
    color = "#FFF",
    quantity = 100,
    staticity = 50,
    ease = 50,
    className = "",
}) => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const context = useRef(null);
    const circles = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const canvasSize = useRef({ w: 0, h: 0 });
    const dpr = window.devicePixelRatio || 1;

    const rgbColor = useMemo(() => {
        let hex = color.replace(/^#/, "");
        if (hex.length === 3) {
            hex = hex.split("").map((char) => char + char).join("");
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r} ${g} ${b}`;
    }, [color]);

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }

        const initCanvas = () => {
            resizeCanvas();
            drawParticles();
        };

        const animate = () => {
            clearContext();
            circles.current.forEach((circle, i) => {
                const edge = [
                    circle.x + circle.translateX - circle.size,
                    canvasSize.current.w - circle.x - circle.translateX - circle.size,
                    circle.y + circle.translateY - circle.size,
                    canvasSize.current.h - circle.y - circle.translateY - circle.size,
                ];

                const closestEdge = Math.min(...edge);
                const remapClosestEdge = Math.max(0, Math.min(1, closestEdge / 20));

                if (remapClosestEdge > 1) {
                    circle.alpha += 0.02;
                    if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
                } else {
                    circle.alpha = circle.targetAlpha * remapClosestEdge;
                }

                circle.x += circle.dx;
                circle.y += circle.dy;
                circle.translateX +=
                    (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
                circle.translateY +=
                    (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

                if (
                    circle.x < -circle.size ||
                    circle.x > canvasSize.current.w + circle.size ||
                    circle.y < -circle.size ||
                    circle.y > canvasSize.current.h + circle.size
                ) {
                    circles.current[i] = circleParams();
                } else {
                    drawCircle(circle, true);
                }
            });
            requestAnimationFrame(animate);
        };

        initCanvas();
        animate();

        const handleMouseMove = (e) => {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const { w, h } = canvasSize.current;
                const x = e.clientX - rect.left - w / 2;
                const y = e.clientY - rect.top - h / 2;
                const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
                if (inside) {
                    mouse.current.x = x;
                    mouse.current.y = y;
                }
            }
        };

        window.addEventListener("resize", initCanvas);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", initCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [rgbColor, quantity, staticity, ease]);

    const resizeCanvas = () => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current = [];
            const w = canvasContainerRef.current.offsetWidth;
            const h = canvasContainerRef.current.offsetHeight;
            canvasSize.current = { w, h };
            canvasRef.current.width = w * dpr;
            canvasRef.current.height = h * dpr;
            canvasRef.current.style.width = w + "px";
            canvasRef.current.style.height = h + "px";
            context.current.scale(dpr, dpr);
        }
    };

    const circleParams = () => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return { x, y, translateX, translateY, size, alpha, targetAlpha, dx, dy, magnetism };
    };

    const drawCircle = (circle, update = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.current.save();
            context.current.translate(translateX, translateY);
            context.current.beginPath();
            context.current.arc(x, y, size, 0, 2 * Math.PI);
            context.current.fillStyle = `rgba(${rgbColor.split(" ").join(", ")}, ${alpha})`;
            context.current.fill();
            context.current.restore();

            if (!update) {
                circles.current.push(circle);
            }
        }
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        }
    };

    const drawParticles = () => {
        clearContext();
        for (let i = 0; i < quantity; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    };

    return (
        <div ref={canvasContainerRef} className={className} aria-hidden="true">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ParticlesBg;
