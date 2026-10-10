# Visual assets

- Earth day / normal / specular maps: Three.js r160 examples, downloaded unchanged from https://github.com/mrdoob/three.js/tree/r160/examples/textures/planets . The original filenames are `earth_atmos_2048.jpg`, `earth_normal_2048.jpg`, and `earth_specular_2048.jpg`. Upstream Three.js copyright and MIT license are retained in `vendor/LICENSE.txt`.
- `earth-images.js`: base64 copies of the same images for local `file:` execution. No separately authored image content.
- Lucide 0.468.0: https://lucide.dev/ ; source https://github.com/lucide-icons/lucide ; license in `vendor/LUCIDE-LICENSE.txt`.
- Models, atmospheric shader, and SVG explanatory diagram: constructed within this project. No paid models, runtime CDN, or API key required.

Globe.gl (https://globe.gl/) was evaluated. A second globe renderer was not added because this app also needs local industrial and ocean cross-section scenes. The globe uses the existing Three.js renderer with surface textures and a separate atmosphere shader.

## Cloud rendering and observation photographs

- Actual cloud renderer: `@pmndrs/vanilla` 1.25.0, `core/Cloud.js` and `helpers/deprecated.js`, from https://unpkg.com/@pmndrs/vanilla@1.25.0/core/Cloud.js . MIT, copyright Poimandres; full license in `vendor/DREI-LICENSE.txt`. `vendor/drei-cloud.js` wraps the upstream module in an IIFE, maps its imports to the existing THREE global, and exposes Cloud/Clouds without adding another Three.js version. Rendering logic is retained. This is a visualization helper, not an atmospheric physics model.
- Cloud sprite texture: https://github.com/pmndrs/drei-assets/blob/9225a9f1fbd449d9411125c2f419b843d0308c9f/cloud.png , the default texture referenced by upstream Cloud. `cloud-image.js` is an unchanged base64 copy for file execution. The asset repository has no separate cloud license file; its provenance is preserved here, without asserting the code license separately covers all assets.
- `real-clouds.jpg`: NASA, “Cloud Streets Pave Hudson Bay,” https://science.nasa.gov/earth/earth-observatory/cloud-streets-pave-hudson-bay-6061/ . Credit: Jeff Schmaltz, MODIS Land Rapid Response Team, NASA GSFC.
- `real-bloom.jpg`: NASA Earth Observatory, “Phytoplankton Bloom in the North Atlantic,” https://science.nasa.gov/earth/earth-observatory/phytoplankton-bloom-in-the-north-atlantic-44073/ . MODIS/Terra observation on May 22, 2010. These are reference observations of natural phenomena, not photographs of geoengineering deployments.
- `real-desert-mirrors.jpg`: NASA, “Sun Glint from Solar Electric Generating Stations,” https://science.nasa.gov/earth/earth-observatory/sun-glint-from-solar-electric-generating-stations-4517 . Terra/MISR, April 8, 2003, Kramer Junction and Harper Lake solar fields in the Mojave Desert. Credit NASA/GSFC/LaRC/JPL, MISR Team. Downloaded as `Solarplant_MISR2004099_lrg.jpg` (680×792, four view-angle panels). The top row (46° forward | 26° forward) was cropped and scaled 2× to 1360×784 so the glint is legible at modal size, then encoded at JPEG quality 88. No colour or contrast adjustment, and the original panel labels are kept. The two panels are the same site seen from two MISR view angles — the mirrors appear white only in the angle where their reflected sunlight reaches the camera. Analogue for desert reflectors, not a photograph of a deployment.
- `real-foam.jpg`: NASA Earth Observatory, “Lines of Foam on Garabogazköl,” https://science.nasa.gov/earth/earth-observatory/lines-of-foam-on-garabogazkol-90206 . Landsat 8 OLI, April 4, 2017, image by Joshua Stevens using USGS Landsat data. Downloaded as `garabogazkol_oli_2017094_lrg.jpg` (5639×3759); a 1400×1050 region at native resolution was cropped so the foam lines are legible at modal size, then encoded at JPEG quality 85. No colour or contrast adjustment. Per the NASA caption the bright lines are bubbles formed where surfactants lower surface tension and converging currents concentrate the foam — a natural analogue for microbubble brightening, not a deployment.
- `real-aerosols.jpg`: NASA Earth Observatory, “Astronauts Photograph Mount Pinatubo,” https://science.nasa.gov/earth/earth-observatory/astronauts-photograph-mount-pinatubo/ , paired astronaut photographs STS41D-32-14 (August 30, 1984) and STS043-22-23 (August 8, 1991). The lower photograph shows stratospheric aerosol layers after the eruption. Credit NASA/JSC. This is a natural analogue, not an intentional aerosol deployment.
매머드 전경: Climeworks, 2023년 12월 건설 중 실사. https://climeworks.com/news/mammoth-taking-final-shape . 저작권: Climeworks. 모형은 실제 시설 배치를 재현하지 않음.

첫 화면 아이콘: Phosphor Icons core 2.1.1, duotone. https://github.com/phosphor-icons/core . MIT, Copyright (c) 2023 Phosphor Icons. 원본 SVG와 LICENSE.txt는 assets/phosphor에 보관. 색상 및 배치는 앱 스타일로 적용.

폰트: Pretendard Variable v1.3.9, https://github.com/orioncactus/pretendard . SIL Open Font License 1.1, assets/fonts/OFL.txt. 웹폰트는 로컬 파일로 제공.

학습 설명 검수 참고 (lesson-content.js):
- 구름 형성: NASA, How Do Clouds Form? https://science.nasa.gov/kids/earth/how-do-clouds-form/
- 성층권 입자와 해상 구름: NOAA CSL, https://csl.noaa.gov/news/2024/400_0320.html 및 https://www.gfdl.noaa.gov/aerosols-and-climate/
- 밝은 지붕: U.S. DOE, Guide to Cool Roofs, https://www.energy.gov/sites/prod/files/guide_to_cool_roofs.pdf
- 공기에서 CO₂ 포집·저장: Climeworks, https://climeworks.com/carbon-removal-technology
- 심층수와 영양분: NOAA, https://oceanservice.noaa.gov/facts/upwelling.html
- 식물 플랑크톤의 광합성: NOAA, https://oceanservice.noaa.gov/facts/plankton.html
- 철분 살포와 탄소 침강의 한계: WHOI, https://www.whoi.edu/ocean-learning-hub/ocean-topics/climate-weather/ocean-based-climate-solutions/iron-fertilization/
설명은 중학생 대상의 교육용 요약이며, 인공구름 장면은 구름 형성에 유리한 조건을 가정한다. 강도와 냉각·탄소 저장량 사이의 실제 수치 관계를 예측하지 않는다.
구름 비교 사진: NASA Earth Observatory, Ship Tracks in the Northern Pacific, Terra/MODIS, 2008-07-13. https://science.nasa.gov/earth/earth-observatory/ship-tracks-in-the-northern-pacific-20248/ . 동일 관측 사진 안의 구름 많은 영역과 구름 사이 바다를 비교하며, 실험 전후 사진이 아님.

번성 색상 참고: NASA, What are Phytoplankton? https://www.naturalhazards.nasa.gov/features/Phytoplankton . 일부 석회질 껍질을 가진 종은 유백색·밝은 청록색을 만들지만 모든 플랑크톤 번성이 흰색인 것은 아님. 모형의 번성 색과 면적은 원리 관찰용으로 단순화.


Mammoth storage principle: captured CO₂ is dissolved in water and injected into basalt, where carbonate minerals form. Official references: https://climeworks.com/news/climeworks-mammoth-construction-update-oct23 and https://www.carbfix.com/carbfix101
