import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 10, // 10개의 방 생성
};

const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';

export default function () {
  const roomNumber = __ITER + 1;

  console.log(`[${roomNumber}/10] Creating test room...`);

  // 1. 방 생성
  const createPayload = JSON.stringify({
    title: `Test ${roomNumber}`,
    availableDateSlots: generateDateSlots(7),
    availableTimeSlots: generateTimeSlots(),
    deadline: '2026-12-31T23:30',
  });

  const createRes = http.post(`${BASE_URL}/api/v1/rooms`, createPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(createRes, {
    'room created': (r) => r.status === 200,
  });

  if (createRes.status !== 200) {
    console.error(`Failed to create room ${roomNumber}: ${createRes.status}`);
    console.error(`Response body: ${createRes.body}`);
    return;
  }

  const responseData = JSON.parse(createRes.body);
  console.log(`Response: ${createRes.body}`);

  if (!responseData.data || !responseData.data.session) {
    console.error(`No session in response for room ${roomNumber}`);
    return;
  }

  const roomSession = responseData.data.session;
  console.log(`✓ Room created: ${roomSession}`);

  // 2. 참가자 10~20명 생성 및 투표 추가
  const participantCount = Math.floor(Math.random() * 11) + 10; // 10~20명
  console.log(`  Adding ${participantCount} participants...`);

  for (let i = 0; i < participantCount; i++) {
    const participantName = `Participant_R${roomNumber}_${i + 1}`;

    // 참가자 생성
    const createParticipantPayload = JSON.stringify({
      participantName: participantName,
    });

    const participantRes = http.post(
      `${BASE_URL}/api/v1/rooms/${roomSession}/participants`,
      createParticipantPayload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (participantRes.status === 200) {
      // 투표 추가
      const votePayload = JSON.stringify({
        participantName: participantName,
        dateTimeSlots: generateRandomDateTimeSlots(),
      });

      const voteRes = http.put(
        `${BASE_URL}/api/v1/rooms/${roomSession}/votes/participants`,
        votePayload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (voteRes.status === 200) {
        console.log(`  ✓ Participant ${i + 1}/${participantCount}: ${participantName}`);
      }
    }

    // 서버 부하 방지를 위한 짧은 대기
    sleep(0.1);
  }

  console.log(`✓ Room ${roomNumber} setup complete!\n`);
  sleep(1); // 다음 방 생성 전 대기
}

// 유틸리티 함수
function generateDateSlots(count) {
  const dates = [];
  const today = new Date('2026-01-01');
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function generateTimeSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

function generateRandomDateTimeSlots() {
  const dates = generateDateSlots(7);
  const times = ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const slots = [];
  const count = Math.floor(Math.random() * 3) + 3; // 3~5개 선택

  for (let i = 0; i < count; i++) {
    const date = dates[Math.floor(Math.random() * dates.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    slots.push(`${date}T${time}`);
  }

  return [...new Set(slots)]; // 중복 제거
}

// 테스트 완료 후 실행
export function handleSummary(data) {
  console.log('\n=== Setup Complete ===');
  console.log('Created 10 test rooms with participants and votes.');
  console.log('\nNext steps:');
  console.log('1. Note the room session IDs from the logs above');
  console.log('2. Update TEST_ROOMS environment variable in .env.k6');
  console.log('3. Run the performance test: docker compose -f docker-compose.k6.yml up');

  return {
    'results/setup-summary.json': JSON.stringify(data, null, 2),
  };
}
