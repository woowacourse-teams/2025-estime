#!/bin/bash

# 오류 발생 시 즉시 스크립트 종료
set -e

# ====================================================================
#                     MySQL 접속 정보 설정
# ====================================================================
DB_USER="root"
DB_NAME="estimedb"
COMBINED_SQL_FILE="all_in_one.sql"

# ====================================================================
#         스크립트 종료 시 항상 실행될 마무리 함수
# ====================================================================
cleanup() {
    sleep 1
    echo ">> 마무리 작업을 시작합니다..."
    if [ -f "$COMBINED_SQL_FILE" ]; then
        rm "$COMBINED_SQL_FILE"
        echo "-> 임시 통합 SQL 파일($COMBINED_SQL_FILE)을 삭제했습니다."
    fi
    echo ">> 마무리 작업 완료"
}

# 스크립트가 종료될 때 cleanup 함수를 실행하도록 설정
trap cleanup EXIT

# ====================================================================
#      SQL 파일들을 하나의 트랜잭션 파일로 통합
# ====================================================================
echo ">> 모든 SQL 파일을 하나의 트랜잭션으로 통합하는 중..."
echo "START TRANSACTION;" > "$COMBINED_SQL_FILE"

cat test_room.sql >> "$COMBINED_SQL_FILE"
cat test_participant.sql >> "$COMBINED_SQL_FILE"
cat test_room_available_date_slot.sql >> "$COMBINED_SQL_FILE"
cat test_room_available_time_slot.sql >> "$COMBINED_SQL_FILE"
cat test_vote.sql >> "$COMBINED_SQL_FILE"

echo "COMMIT;" >> "$COMBINED_SQL_FILE"

echo ">> 통합 파일 생성 완료: $COMBINED_SQL_FILE"

# ====================================================================
#               쿼리 통합 파일 실행
# ====================================================================
echo ">> 테스트용 데이터 삽입을 시작합니다."

mysql --default-character-set=utf8mb4 -u "$DB_USER" -p "$DB_NAME" < "$COMBINED_SQL_FILE"

echo "✅ 테스트 데이터 삽입 작업이 성공적으로 완료되었습니다."
