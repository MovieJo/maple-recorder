# Maple Recorder

화면 공유를 통해 게임 화면 일부를 OCR로 읽어 시계열 데이터로 기록하는 실험용 SPA입니다.

- 브라우저에서만 동작하며 모든 데이터는 로컬에서 처리되고 서버로 전송되지 않습니다.
- ROI(관심 영역)를 드래그 또는 슬라이더로 지정할 수 있습니다.
- 추출된 값은 타임라인과 Recharts 라인 차트로 동시에 시각화됩니다.

## 개발

```bash
npm install
npm run dev
```

## 배포

GitHub Pages 기준:

[https://MovieJo.github.io/maple-recorder](https://MovieJo.github.io/maple-recorder)

```bash
npm run build
npm run deploy
```

## License

Apache-2.0
