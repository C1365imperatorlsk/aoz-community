# Island artwork audit — 2026-11-27

Source: user-provided xr2222222.apk, reconstructed from all seven 7z volumes.
APK size: 1,281,394,353 bytes
SHA-256: 60298f93d11ff9e7c01131599a939d426c759af53b2626985c9081d68672ea9b

The ZIP has 1,964 entries, including 860 .cmlbundle files. 859 bundles were decompressed and searched for the eight missing object IDs and English names. One manifest_in.cmlbundle did not parse with the UnityFS reader. Exact missing object IDs were found in lualocale_10.cmlbundle, but not as icon names in the scanned asset bundles.

The original graphic library on Drive contains 1,184 extracted images. The main island sprite atlas is assets/d_decorationsystemui.cmlbundle (D_DecorationSystemUI). Its verified fragment images depict the following objects:

| Object ID | English object name | Fragment ID |
|---|---|---|
| 402653278 | North Star | 67698891 |
| 402653279 | EMP Speedboat | 67698892 |
| 402653282 | Grand Ferris Wheel | 67698897 |
| 402653283 | Yellow Submarine | 67698898 |

Each relation is confirmed by islandSource1724.patch (10 fragments exchange for its parent). The fragment artwork is labeled as such in all eight locales. No new or guessed artwork is used.

Still missing confirmed artwork: 402653272 Ultimate-Rock Star, 402653273 Ultimate-Disaster Emperor, 402653276 Sentinel Fortress, 402653277 Science Lighthouse. The last two fragment IDs (67698887, 67698888) were not present in the extracted atlas. The UI shows explicit placeholders. These objects remain usable in the calculator.

Coverage: 78 direct object icons + 4 confirmed fragment illustrations = 82/86 catalog objects with artwork. Four harbor building icons are separate and present.

Validation: the existing UI regression script was executed with a simulated DOM, yielding 1,608 screen checks, 3,136 interactions, eight locales and zero failures, including the new alias and placeholder assertions. Actual Chromium/Telegram visual validation is still required. Do not treat this audit as a claim of full visual QA or that missing assets cannot exist in downloaded game resources.
