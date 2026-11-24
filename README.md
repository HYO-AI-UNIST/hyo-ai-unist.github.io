# Hyogi Kim — Research profile & CV

Website: **https://hyo-ai-unist.github.io**

A lightweight research homepage with project details, a web CV, and a downloadable PDF CV. No third-party scripts, analytics, fonts, or runtime dependencies.

## 내용 수정하기

프로필, 프로젝트, CV의 상세 내용은 아래 파일에서 관리합니다.

| 수정할 내용 | 파일 |
|---|---|
| 소개, 관심사, 소속, 이메일, 기술, 갱신 날짜 | `content/profile.json` |
| 프로젝트 추가·수정, 역할, 설명, 링크 | `content/projects.json` |
| 웹 CV 내용 및 LaTeX 원본 | `content/cv.json` |
| 색상, 글자 크기, 여백, 모바일 레이아웃 | `assets/site.css` |

### 수정하고 배포하기

1. 해당 JSON 파일에서 내용을 수정합니다. 프로젝트 `id`에는 영문 소문자·숫자·하이픈을 사용합니다.
2. 아래 명령으로 웹페이지를 다시 생성합니다. Node.js 외에 설치할 패키지는 없습니다.

```bash
node scripts/build.mjs
```

3. PDF 내용도 바뀌었다면 검토한 공개용 PDF를 `assets/Hyogi_Kim_CV.pdf`에 넣습니다. LaTeX 원본으로 새 PDF를 만드는 경우에는 아래 명령을 사용합니다.

```bash
mkdir -p .build
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=.build cv/Hyogi_Kim_CV.tex
cp .build/Hyogi_Kim_CV.pdf assets/Hyogi_Kim_CV.pdf
```

4. 원본과 생성된 HTML/PDF를 함께 커밋하고 `main`에 push합니다. GitHub Pages가 자동 배포합니다.

```bash
git add content scripts assets projects index.html cv.html cv robots.txt sitemap.xml 404.html
git commit -m "Update research profile"
git push
```

GitHub 웹 편집기에서 JSON만 고치면 생성된 HTML에는 자동 반영되지 않습니다. 빌드 결과도 함께 올려야 합니다. Codex에 이 저장소를 열고 “프로젝트를 추가하고 빌드해서 배포해줘”라고 요청해도 됩니다.

### 새 프로젝트 추가

`content/projects.json`의 항목 하나를 복사하고 `id`, `title`, `status`, `summary`, `role`, `sections`, `cv`를 수정한 다음 빌드하세요. `code`는 공개 저장소 URL이 있을 때만 추가합니다. 배열의 순서가 홈페이지의 표시 순서입니다. CV에는 `content/cv.json`에서 해당 프로젝트를 추가합니다.

### 로컬 미리보기

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

`http://127.0.0.1:8000`에서 확인합니다. 모든 본문은 JavaScript 없이도 읽을 수 있습니다.

## GitHub Pages 설정

Settings → Pages → **Deploy from a branch** → `main` / `/(root)`.

`.nojekyll`은 생성된 정적 파일을 그대로 배포하도록 합니다.

## Content notes

- Distinguish ongoing research, proposals, and completed project results.
- Keep personal contributions separate from team-level results.
- Include only confirmed academic and honors information.
- Maestro measurements refer to its bundled on-device ONNX models and knowledge-tracing step, not the entire application.
- This repository contains public profile information only; source reports and application materials are not included.
