// SSE 부하 테스트 (Node.js 스크립트)
// k6와 병행 실행하여 SSE 연결 부하 생성

const EventSource = require('eventsource');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const ROOM_SESSIONS = [
  'session-1',
  'session-2',
  'session-3',
  'session-4',
  'session-5',
  'session-6',
  'session-7',
  'session-8',
  'session-9',
  'session-10',
];

const SSE_CONNECTIONS = 90; // 시나리오 B(40) + 시나리오 C(50)
const TEST_DURATION = 5 * 60 * 1000; // 5분

console.log(`🚀 Starting SSE load test...`);
console.log(`   Connections: ${SSE_CONNECTIONS}`);
console.log(`   Duration: 5 minutes`);
console.log(`   Target: ${BASE_URL}\n`);

const connections = [];
let messageCount = 0;
let errorCount = 0;

// SSE 연결 생성
for (let i = 0; i < SSE_CONNECTIONS; i++) {
  const roomSession = ROOM_SESSIONS[i % ROOM_SESSIONS.length];
  const url = `${BASE_URL}/api/v1/sse/rooms/${roomSession}/stream`;

  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log(`✓ Connection ${i + 1}/${SSE_CONNECTIONS} established: ${roomSession}`);
  };

  eventSource.onmessage = (event) => {
    messageCount++;
    if (messageCount % 10 === 0) {
      console.log(`📨 Received ${messageCount} messages`);
    }
  };

  eventSource.addEventListener('vote-changed', (event) => {
    messageCount++;
  });

  eventSource.onerror = (error) => {
    errorCount++;
    console.error(`❌ Connection error (${i + 1}):`, error.message || 'Unknown error');
  };

  connections.push(eventSource);

  // 연결 간격 (과부하 방지)
  if ((i + 1) % 10 === 0) {
    await sleep(100);
  }
}

console.log(`\n✓ All ${SSE_CONNECTIONS} connections established\n`);

// 5분 후 종료
setTimeout(() => {
  console.log('\n⏱️  Test duration completed. Closing connections...\n');

  connections.forEach((eventSource, i) => {
    eventSource.close();
    if ((i + 1) % 10 === 0) {
      console.log(`Closed ${i + 1}/${SSE_CONNECTIONS} connections`);
    }
  });

  console.log('\n📊 Test Summary:');
  console.log(`   Total messages received: ${messageCount}`);
  console.log(`   Total errors: ${errorCount}`);
  console.log(`   Success rate: ${((1 - errorCount / SSE_CONNECTIONS) * 100).toFixed(2)}%`);
  console.log('\n✅ SSE load test completed\n');

  process.exit(0);
}, TEST_DURATION);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
