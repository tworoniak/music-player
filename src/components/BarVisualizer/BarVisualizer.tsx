import { useEffect, useRef } from "react";

type BarVisualizerProps = {
  analyser: AnalyserNode;
  height?: number;
  isPlaying: boolean;
  barCount?: number; // optional, default 64
};

const BarVisualizer = ({
  analyser,
  height = 80,
  isPlaying,
  barCount = 64,
}: BarVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const peakRef = useRef<number[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      requestAnimationFrame(draw);

      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      // Fading trail
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const step = Math.floor(dataArray.length / barCount);
      const barWidth = canvas.width / barCount - 2; // 2px spacing

      if (peakRef.current.length !== barCount) {
        peakRef.current = new Array(barCount).fill(0);
      }

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * canvas.height;
        const x = i * (barWidth + 2);

        // Bar glow
        const hue = Math.floor((i / barCount) * 270);
        ctx.shadowBlur = 2;
        ctx.shadowColor = `hsl(${hue}, 80%, 70%)`;

        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Peak bounce
        const decaySpeed = Math.max(1, (255 - value) / 10);
        peakRef.current[i] = Math.max(
          peakRef.current[i] - decaySpeed,
          barHeight,
        );

        // Peak glow
        ctx.shadowBlur = 2;
        ctx.shadowColor = `hsl(${hue}, 100%, 85%)`;
        ctx.fillStyle = `hsl(${hue}, 100%, 85%)`;
        ctx.fillRect(x, canvas.height - peakRef.current[i] - 2, barWidth, 2);
      }

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    };

    draw();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [analyser, height, isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className='w-full block rounded-md'
      style={{ background: "transparent" }}
    />
  );
};

export default BarVisualizer;
