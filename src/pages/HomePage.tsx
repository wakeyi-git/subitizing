import { Link } from 'react-router-dom';

function DotCardIcon() {
  return (
    <svg viewBox="0 0 120 120" width={120} height={120}>
      {/* Soft background circle */}
      <circle cx={60} cy={60} r={56} fill="#FEE2E2" />
      {/* Dice-5 pattern */}
      <circle cx={36} cy={36} r={10} fill="#E74C3C" />
      <circle cx={84} cy={36} r={10} fill="#E74C3C" />
      <circle cx={60} cy={60} r={10} fill="#E74C3C" />
      <circle cx={36} cy={84} r={10} fill="#E74C3C" />
      <circle cx={84} cy={84} r={10} fill="#E74C3C" />
    </svg>
  );
}

function TenFrameIcon() {
  const cellW = 17;
  const cellH = 20;
  const gap = 2;
  const cols = 5;
  const rows = 2;
  const totalW = cols * (cellW + gap) - gap;
  const totalH = rows * (cellH + gap) - gap;
  const offsetX = (120 - totalW) / 2;
  const offsetY = (120 - totalH) / 2;
  const filled = 7;

  return (
    <svg viewBox="0 0 120 120" width={120} height={120}>
      <circle cx={60} cy={60} r={56} fill="#DBEAFE" />
      {Array.from({ length: 10 }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = offsetX + col * (cellW + gap);
        const y = offsetY + row * (cellH + gap);
        return (
          <g key={i}>
            <rect
              x={x} y={y}
              width={cellW} height={cellH}
              rx={3}
              fill={i < filled ? '#3498DB' : 'white'}
              stroke="#2C3E50"
              strokeWidth={1.5}
              opacity={i < filled ? 1 : 0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight mb-4">
          직산 연습
        </h1>
        <p className="text-xl text-gray-400 font-light">
          세지 않고 한눈에 수량을 파악하는 연습
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl w-full">
        <Link
          to="/dots"
          className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
            <DotCardIcon />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">점 카드</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            다양한 배열의 점을 짧은 시간 동안 보여주고,
            한눈에 수량을 파악하는 연습
          </p>
          <div className="mt-6 px-5 py-2 rounded-full bg-red-50 text-dot-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            시작하기 →
          </div>
        </Link>

        <Link
          to="/ten-frame"
          className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
            <TenFrameIcon />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">십 프레임</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            2×5 격자를 활용하여 수량 파악과
            10의 보수를 연습
          </p>
          <div className="mt-6 px-5 py-2 rounded-full bg-blue-50 text-dot-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            시작하기 →
          </div>
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-16 text-sm text-gray-300">
        교사용 프레젠테이션 도구 — 교실 모니터 또는 프로젝터에서 사용하세요
      </p>
    </div>
  );
}
