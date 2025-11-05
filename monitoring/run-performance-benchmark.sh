#!/bin/bash

# V1 vs V2 성능 벤치마크 실행 스크립트

echo "========================================="
echo "V1 vs V2 Performance Benchmark"
echo "========================================="
echo ""

# 결과 파일
OUTPUT_FILE="monitoring/performance-benchmark-results.txt"

# 테스트 실행
./gradlew :core:cleanTest :core:test --tests "V1V2PerformanceBenchmarkTest" > /tmp/benchmark.log 2>&1

# 테스트 리포트 확인
echo "테스트 완료!"
echo ""
echo "결과 확인:"
echo "  - HTML 리포트: core/build/reports/tests/test/index.html"
echo "  - XML 결과: core/build/test-results/test/"
echo ""

# HTML 리포트 열기 (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "HTML 리포트를 브라우저에서 열고 있습니다..."
    open core/build/reports/tests/test/index.html
fi
