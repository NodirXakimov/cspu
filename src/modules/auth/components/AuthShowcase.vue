<script setup lang="ts">
import { Wallet, TrendingUp, Users, GraduationCap, Activity } from 'lucide-vue-next'
</script>

<template>
  <aside class="showcase">
    <!-- ── decorative layers ─────────────────────────────────────────── -->
    <span class="blob blob--a" aria-hidden="true" />
    <span class="blob blob--b" aria-hidden="true" />
    <span class="grid-dots" aria-hidden="true" />

    <!-- campus silhouette -->
    <svg class="campus" viewBox="0 0 800 260" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <!-- dome + tower -->
      <path d="M400 26c14 0 26 11 26 25 0 9-4 16-11 21h-30c-7-5-11-12-11-21 0-14 12-25 26-25z" />
      <rect x="396" y="8" width="8" height="20" rx="4" />
      <rect x="366" y="72" width="68" height="30" rx="4" />
      <!-- main block -->
      <path d="M300 102h200v158H300z" />
      <!-- colonnade -->
      <g>
        <rect v-for="i in 7" :key="`c${i}`" :x="312 + (i - 1) * 26" y="128" width="12" height="132" rx="6" />
      </g>
      <!-- wings -->
      <path d="M150 150h150v110H150zM500 150h150v110H500z" />
      <g>
        <rect v-for="i in 5" :key="`wl${i}`" :x="168 + (i - 1) * 26" y="176" width="14" height="20" rx="3" />
        <rect v-for="i in 5" :key="`wr${i}`" :x="518 + (i - 1) * 26" y="176" width="14" height="20" rx="3" />
        <rect v-for="i in 5" :key="`wl2${i}`" :x="168 + (i - 1) * 26" y="212" width="14" height="20" rx="3" />
        <rect v-for="i in 5" :key="`wr2${i}`" :x="518 + (i - 1) * 26" y="212" width="14" height="20" rx="3" />
      </g>
      <!-- steps -->
      <path d="M270 250h260v10H270zM286 238h228v12H286z" />
    </svg>

    <!-- ── content ───────────────────────────────────────────────────── -->
    <div class="content">
      <div class="brand">
        <span class="brand-mark">U</span>
        <span class="brand-text">
          <span class="brand-name">{{ $t('app.shortTitle') }}</span>
          <span class="brand-sub">{{ $t('app.title') }}</span>
        </span>
      </div>

      <!-- floating monitoring cards -->
      <div class="cards">
        <!-- attendance trend -->
        <div class="glass card-trend float-a">
          <div class="card-head">
            <span class="card-title">{{ $t('auth.showcase.attendance') }}</span>
            <span class="card-value">
              91%
              <el-icon :size="14"><TrendingUp /></el-icon>
            </span>
          </div>
          <svg class="spark" viewBox="0 0 240 68" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.38" />
                <stop offset="100%" stop-color="#fff" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 50 L40 40 L80 46 L120 26 L160 32 L200 14 L240 20 L240 68 L0 68 Z"
              fill="url(#sparkFill)"
            />
            <polyline
              class="spark-line"
              points="0,50 40,40 80,46 120,26 160,32 200,14 240,20"
              fill="none"
              stroke="#fff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle class="spark-dot" cx="240" cy="20" r="4" fill="#fff" />
          </svg>
        </div>

        <!-- faculty bars -->
        <div class="glass card-bars float-b">
          <span class="card-title">{{ $t('auth.showcase.stats.faculties') }}</span>
          <div class="bars">
            <span v-for="(h, i) in [46, 72, 58, 88, 64, 40]" :key="i" :style="{ height: `${h}%` }" />
          </div>
        </div>

        <!-- payment collection ring -->
        <div class="glass card-ring float-c">
          <!-- NB: not `.ring` — that collides with Tailwind's ring utility -->
          <div class="pay-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <!-- Glow lives inside the SVG with an explicit region: a CSS
                     drop-shadow would be clipped square by the SVG viewport. -->
                <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="2.5"
                    flood-color="#fff"
                    flood-opacity="0.5"
                  />
                </filter>
              </defs>
              <circle class="ring-track" cx="60" cy="60" r="45" />
              <circle class="ring-value" cx="60" cy="60" r="45" filter="url(#ringGlow)" />
            </svg>
            <span class="ring-center">
              <el-icon :size="16"><Wallet /></el-icon>
              <b>82%</b>
            </span>
          </div>
          <span class="card-title">{{ $t('auth.showcase.payments') }}</span>
          <span class="ring-status">
            <span class="pulse" />{{ $t('auth.showcase.live') }}
          </span>
        </div>
      </div>

      <div class="copy">
        <h2 class="headline">{{ $t('auth.showcase.headline') }}</h2>
        <p class="strapline">{{ $t('auth.showcase.strapline') }}</p>

        <div class="chips">
          <span class="chip">
            <el-icon :size="15"><Users /></el-icon>
            <b>5 970</b>{{ $t('auth.showcase.stats.students') }}
          </span>
          <span class="chip">
            <el-icon :size="15"><GraduationCap /></el-icon>
            <b>6</b>{{ $t('auth.showcase.stats.faculties') }}
          </span>
          <span class="chip">
            <el-icon :size="15"><Activity /></el-icon>
            <b>24/7</b>{{ $t('auth.showcase.stats.uptime') }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.showcase {
  position: relative;
  overflow: hidden;
  height: 100%;
  color: #fff;
  background:
    radial-gradient(120% 90% at 85% 5%, #3b82f6 0%, transparent 55%),
    linear-gradient(155deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 100%);
}

/* --- decorative ---------------------------------------------------- */
.blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.55;
  pointer-events: none;
}
.blob--a {
  width: 420px;
  height: 420px;
  top: -140px;
  right: -120px;
  background: #60a5fa;
}
.blob--b {
  width: 360px;
  height: 360px;
  bottom: -120px;
  left: -110px;
  background: #8b5cf6;
  opacity: 0.4;
}
.grid-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(115% 85% at 50% 20%, #000 25%, transparent 75%);
  pointer-events: none;
}
.campus {
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 130%;
  max-width: 900px;
  transform: translateX(-50%);
  fill: rgba(255, 255, 255, 0.07);
  pointer-events: none;
}

/* --- content ------------------------------------------------------- */
.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  height: 100%;
  padding: 40px 44px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  font-size: 19px;
  font-weight: 800;
  color: #1d4ed8;
  background: #fff;
  box-shadow: 0 8px 22px -8px rgba(0, 0, 0, 0.55);
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.brand-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.brand-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* --- glass cards ---------------------------------------------------- */
.cards {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  grid-template-areas:
    'trend ring'
    'bars  ring';
  gap: 16px;
  align-content: center;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}
.glass {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px -22px rgba(2, 12, 40, 0.9);
  padding: 16px;
}
.card-trend {
  grid-area: trend;
}
.card-bars {
  grid-area: bars;
}
.card-ring {
  grid-area: ring;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.card-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
}
.card-value {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.spark {
  display: block;
  width: 100%;
  height: 62px;
}
.spark-line {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: draw 2.4s ease forwards 0.3s;
}
.spark-dot {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 2.5s;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  height: 62px;
  margin-top: 12px;
}
.bars span {
  flex: 1;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.42));
  transform-origin: bottom;
  animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
.bars span:nth-child(1) { animation-delay: 0.25s; }
.bars span:nth-child(2) { animation-delay: 0.35s; }
.bars span:nth-child(3) { animation-delay: 0.45s; }
.bars span:nth-child(4) { animation-delay: 0.55s; }
.bars span:nth-child(5) { animation-delay: 0.65s; }
.bars span:nth-child(6) { animation-delay: 0.75s; }

/* Payment collection ring */
.pay-ring {
  position: relative;
  width: 104px;
  height: 104px;
}
.pay-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.pay-ring circle {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
}
.ring-track {
  stroke: rgba(255, 255, 255, 0.2);
}
.ring-value {
  stroke: #fff;
  /* 2πr (r=45) = 282.74; 82% filled → offset 282.74 × 0.18 = 50.9 */
  stroke-dasharray: 282.74;
  stroke-dashoffset: 282.74;
  animation: ring-fill 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.4s;
}
.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  color: rgba(255, 255, 255, 0.85);
}
.ring-center b {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
}
.ring-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}
.pulse {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  animation: pulse 1.8s ease-out infinite;
}

/* --- copy ----------------------------------------------------------- */
.headline {
  margin: 0 0 10px;
  font-size: 29px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
  max-width: 15ch;
}
.strapline {
  margin: 0 0 20px;
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.78);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
}
.chip b {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
}

/* --- motion --------------------------------------------------------- */
.float-a { animation: float 7s ease-in-out infinite; }
.float-b { animation: float 7s ease-in-out infinite 0.9s; }
.float-c { animation: float 7s ease-in-out infinite 1.8s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}
@keyframes ring-fill {
  to { stroke-dashoffset: 50.9; }
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fadeIn {
  to { opacity: 1; }
}
@keyframes rise {
  from { transform: scaleY(0.1); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .float-a, .float-b, .float-c, .pulse, .bars span, .spark-line, .spark-dot, .ring-value {
    animation: none;
  }
  .spark-line { stroke-dashoffset: 0; }
  .spark-dot { opacity: 1; }
  .ring-value { stroke-dashoffset: 50.9; }
}

/* Tighter padding on shorter / narrower desktops */
@media (max-height: 780px) {
  .content { padding: 28px 32px; gap: 18px; }
  .headline { font-size: 25px; }
  .cards { max-width: 480px; }
}
</style>
