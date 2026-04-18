"use client";

interface RiskGaugeProps {
    score: number;
}

export default function RiskGauge({ score }: RiskGaugeProps) {
    const clampedScore = Math.max(0, Math.min(100, score));
    // Arc: half circle, radius=60, strokeWidth=12
    const r = 60;
    const cx = 80;
    const cy = 80;
    const circumference = Math.PI * r; // half circle
    const dashOffset = circumference * (1 - clampedScore / 100);

    const color =
        clampedScore >= 70
            ? "#ef4444"
            : clampedScore >= 40
                ? "#f97316"
                : clampedScore >= 20
                    ? "#eab308"
                    : "#22c55e";

    const label =
        clampedScore >= 70
            ? "Rủi ro cao"
            : clampedScore >= 40
                ? "Rủi ro trung bình"
                : clampedScore >= 20
                    ? "Rủi ro thấp"
                    : "Không có rủi ro";

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="160" height="90" viewBox="0 0 160 90">
                {/* Background track */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                {/* Color zones */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${dashOffset}`}
                    style={{
                        transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
                    }}
                />
                {/* Score text */}
                <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    className="fill-gray-900 dark:fill-white"
                    fontSize="28"
                    fontWeight="700"
                    fill="currentColor"
                >
                    {clampedScore}
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#9ca3af">
                    / 100
                </text>
            </svg>
            <p className="text-sm font-semibold" style={{ color }}>
                {label}
            </p>
        </div>
    );
}
