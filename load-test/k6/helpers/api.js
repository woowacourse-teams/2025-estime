import http from 'k6/http';
import { check, fail } from 'k6';
import { BASE_URL, HEADERS } from '../config.js';

// 서버 타임존: Asia/Seoul (UTC+9)
function getKSTDateStr(daysFromNow) {
  const now = new Date();
  const kstNow = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  kstNow.setDate(kstNow.getDate() + daysFromNow);
  const y = kstNow.getFullYear();
  const m = String(kstNow.getMonth() + 1).padStart(2, '0');
  const d = String(kstNow.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// V1 방 생성용: 날짜 목록 생성 ["2026-02-13", "2026-02-14"]
export function generateDateSlots(daysFromNow, dayCount) {
  const dates = [];
  for (let i = 0; i < dayCount; i++) {
    dates.push(getKSTDateStr(daysFromNow + i));
  }
  return dates;
}

// V1 방 생성용: 시간 목록 생성 ["09:00", "09:30", "10:00"]
export function generateTimeSlots(startHour, slotCount) {
  const times = [];
  for (let i = 0; i < slotCount; i++) {
    const hour = startHour + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    times.push(`${h}:${m}`);
  }
  return times;
}

// V1 투표용: dateSlots x timeSlots → dateTimeSlots ["2026-02-13T09:00", ...]
export function combineDateTimeSlots(dateSlots, timeSlots) {
  const result = [];
  for (const date of dateSlots) {
    for (const time of timeSlots) {
      result.push(`${date}T${time}`);
    }
  }
  return result;
}

function assertSuccess(res, label) {
  if (res.status !== 200) {
    console.error(`${label} HTTP ${res.status}: ${res.body.substring(0, 200)}`);
    fail(`${label} FAILED: HTTP ${res.status}`);
  }

  let body;
  try {
    body = res.json();
  } catch (e) {
    console.error(`${label} NOT JSON: ${res.body.substring(0, 200)}`);
    fail(`${label} FAILED: response is not JSON`);
  }

  const passed = check(null, {
    [`${label} success`]: () => body.success === true,
  });
  if (!passed) {
    fail(`${label} FAILED: success=false, message=${body.message}`);
  }
  return body.data;
}

export function createRoom(title, dateSlots, timeSlots) {
  const deadlineDate = new Date();
  const kstNow = new Date(deadlineDate.getTime() + (9 * 60 + deadlineDate.getTimezoneOffset()) * 60000);
  // 마지막 날짜 + 1일을 deadline으로
  const lastDate = new Date(dateSlots[dateSlots.length - 1] + 'T00:00:00');
  lastDate.setDate(lastDate.getDate() + 1);
  const y = lastDate.getFullYear();
  const m = String(lastDate.getMonth() + 1).padStart(2, '0');
  const d = String(lastDate.getDate()).padStart(2, '0');
  const deadlineStr = `${y}-${m}-${d}T23:59`;

  const body = JSON.stringify({
    title: title,
    availableDateSlots: dateSlots,
    availableTimeSlots: timeSlots,
    deadline: deadlineStr,
  });

  const res = http.post(`${BASE_URL}/api/v1/rooms`, body, { headers: HEADERS });
  const data = assertSuccess(res, 'room created');
  return data.session;
}

export function getRoom(session) {
  const res = http.get(`${BASE_URL}/api/v1/rooms/${session}`, { headers: HEADERS });
  return assertSuccess(res, 'room fetched');
}

export function createParticipant(session, name) {
  const body = JSON.stringify({ participantName: name });
  const res = http.post(
    `${BASE_URL}/api/v1/rooms/${session}/participants`,
    body,
    { headers: HEADERS },
  );
  const data = assertSuccess(res, 'participant created');

  check(data, {
    'participant is new': (d) => d.isDuplicateName === false,
  });
  if (data.isDuplicateName) {
    fail(`participant '${name}' already exists in session ${session}`);
  }

  return data;
}

export function updateVotes(session, participantName, dateTimeSlots) {
  const body = JSON.stringify({
    participantName: participantName,
    dateTimeSlots: dateTimeSlots,
  });
  const res = http.put(
    `${BASE_URL}/api/v1/rooms/${session}/votes/participants`,
    body,
    { headers: HEADERS },
  );
  return assertSuccess(res, 'votes updated');
}

export function getStatistics(session) {
  const res = http.get(
    `${BASE_URL}/api/v1/rooms/${session}/statistics/date-time-slots`,
    { headers: HEADERS },
  );
  return assertSuccess(res, 'statistics fetched');
}

export function getParticipantVotes(session, participantName) {
  const res = http.get(
    `${BASE_URL}/api/v1/rooms/${session}/votes/participants?participantName=${encodeURIComponent(participantName)}`,
    { headers: HEADERS },
  );
  return assertSuccess(res, 'participant votes fetched');
}
