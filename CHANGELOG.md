# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.5.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.4.11...v3.5.0) (2019-11-21)


### Features

* added beta badge ([d1b9629](https://github.com/QbitArtifacts/rec-admin/commit/d1b9629ff0cf690070152bf163956445161bcdf5))
* Added lw in/out concept ([376c4a4](https://github.com/QbitArtifacts/rec-admin/commit/376c4a4cd8dc22e8b42e00ee3efff14bb2b25740))
* **lemonway:** hooked money out dialog to lw api ([6e8bbc5](https://github.com/QbitArtifacts/rec-admin/commit/6e8bbc5eed06dd01954b4cdab4062b57ee6bd335))
* implemented lw call and hooked some data (WIP) ([4be5942](https://github.com/QbitArtifacts/rec-admin/commit/4be5942a80bbfb3f912d23eb6f69dde5452f7fe0))
* **account:** added withdrawals and wallet 2 wallet tabs ([9bb9d2c](https://github.com/QbitArtifacts/rec-admin/commit/9bb9d2c7eb247491b68e62da4f547f78e58af94b))
* **lemonway:** added lemonwaywallet to wallet calls and hooked up to dialogs ([d623a4b](https://github.com/QbitArtifacts/rec-admin/commit/d623a4b900b0a673b2e32554732089a6a12e467e))
* **lemonway:** added p2p transaction list ([422ef37](https://github.com/QbitArtifacts/rec-admin/commit/422ef375bf7b716d3789b2af939e359d9ec09090))
* **lemonway:** Added refresh lemonway info in accounts table ([7b7809c](https://github.com/QbitArtifacts/rec-admin/commit/7b7809c584f908608424cb3b48a90e1099f6dafb))
* **lemonway:** added status to lemonway tx list, and tooltip to tl-table ([2a7c18f](https://github.com/QbitArtifacts/rec-admin/commit/2a7c18fdabf145c58b2d2fe6a6b6bde38f5c7d51))
* **lemonway:** list cashouts and p2p transactions working ([c6d43ba](https://github.com/QbitArtifacts/rec-admin/commit/c6d43ba7a4322a6b278520d19ecea98642c04306))
* removed Exchangers section, now accessible from accounts section ([6d5ad52](https://github.com/QbitArtifacts/rec-admin/commit/6d5ad52ec6245e9875f077dbe9cc5ada7ce20064))
* **refactor:** refactored all badge markup into its own standalone component ([b4b9377](https://github.com/QbitArtifacts/rec-admin/commit/b4b9377b0df02fd9b73cd59efad4cf1f894dbc75))
* **tl-table-header:** added show refresh button and made search button not shown by deafult ([7014349](https://github.com/QbitArtifacts/rec-admin/commit/7014349295395b411d990e2e307487ccc46f744e))
* **ui:** added icon-button component ([cd4b12a](https://github.com/QbitArtifacts/rec-admin/commit/cd4b12a811eb6c4013bf934fa30a489f9bf7f390))
* **ui:** separated modal header into its own component ([67b7c70](https://github.com/QbitArtifacts/rec-admin/commit/67b7c7005d13f124ad0b3bc1cece396cad1294be))


### Bug Fixes

* added translations and sync lemonway ([e2ff049](https://github.com/QbitArtifacts/rec-admin/commit/e2ff0499ee4c3986f4caaff044ffb392e66bccc3))
* Change language sending array instead of string ([742d7d1](https://github.com/QbitArtifacts/rec-admin/commit/742d7d199cb2c191719c8583077ede8af2286a12))
* changed titles based on functional document ([12dda6d](https://github.com/QbitArtifacts/rec-admin/commit/12dda6d78e50c47925838a3d9482ab719473a41c))
* fixed bad locale being sent to edit user ([6f5ea04](https://github.com/QbitArtifacts/rec-admin/commit/6f5ea04c496fd99d20f29f5f1ecd5988fd13fc26))
* fixed issues in mailing and added attachments to table ([6039cb9](https://github.com/QbitArtifacts/rec-admin/commit/6039cb96cf29e3747b7aa4f6e945794334c53e52))
* **tl-table:** added suffix, prefix ([bad3567](https://github.com/QbitArtifacts/rec-admin/commit/bad35678ca857bc78873e1d25bed1e8f20edc8e1))
* fixed some method names ([c01e7e2](https://github.com/QbitArtifacts/rec-admin/commit/c01e7e2d94824007f24c6b06a041ae33649cfe8c))
* replacing hardcoded avatart with avatar component ([d8d0746](https://github.com/QbitArtifacts/rec-admin/commit/d8d07468185734cbc005920862f1bd812163ce45))
* **styles:** changed lw sync button color ([bc988a1](https://github.com/QbitArtifacts/rec-admin/commit/bc988a129dd0c73d9799937850387f1c0c2d58bd))
* separated rxjs pipelines from utils to separated file ([5ee73a3](https://github.com/QbitArtifacts/rec-admin/commit/5ee73a3b613ff15174ce2ef38328bd62fd8ff821))
* **account:** improved account tabs behaviour ([f3e2ff0](https://github.com/QbitArtifacts/rec-admin/commit/f3e2ff0fc2f30ff8242e81dd4b4e904998ce8a3b))
* **accounts:** removed sync lemonway ([a5ee82a](https://github.com/QbitArtifacts/rec-admin/commit/a5ee82ae64df657973a13eb5d9b21a372ce93edd))
* **accounts:b2b:** Removed ability to change pdf preview language ([4f00b11](https://github.com/QbitArtifacts/rec-admin/commit/4f00b11b32ae044ac7c7c44c600507034b1590e1))
* **auth:** added retry to AppToken ([74289f3](https://github.com/QbitArtifacts/rec-admin/commit/74289f34c83ba03d428ee3dd51f6a20fd152abbd))
* **beta-badge:** removed all beta component and some fixes ([13c5bb9](https://github.com/QbitArtifacts/rec-admin/commit/13c5bb96277f923959421fef0e12ab2fa77d124b))
* **build:** Fixed property 'validationErrorName' does not exist ([8cdf1f3](https://github.com/QbitArtifacts/rec-admin/commit/8cdf1f3e830bdd07d6f39cc56f2ffa294c47c27b))
* **cah-out:** added option to cash out to iban ([8fec675](https://github.com/QbitArtifacts/rec-admin/commit/8fec675887496242fe8f7f75f55d33853763f32e))
* **environment:** added account default image to env.dist ([9d5342f](https://github.com/QbitArtifacts/rec-admin/commit/9d5342f1d6f0b8ef9d31538ec6ea45f69586b3f0))
* **i18:** fixed some translations ([0530c80](https://github.com/QbitArtifacts/rec-admin/commit/0530c806c543ce2d35d88d80b91b515ef7d38a0e))
* **lemonway:** added error handling for lw errors ([be6d379](https://github.com/QbitArtifacts/rec-admin/commit/be6d379b2ded4b8b5393027d82068a659b59da86))
* **lemonway:** added error if lemonway error ([34e9111](https://github.com/QbitArtifacts/rec-admin/commit/34e9111830f2c08a6b1a994abc6830bcd1517147))
* **lemonway:** added status code to error ([5ddec18](https://github.com/QbitArtifacts/rec-admin/commit/5ddec186d0a5bed1f0e1f303d3631d55aa0ea325))
* **lemonway:** fixed lemonway tabs not beeing selected ([acd9950](https://github.com/QbitArtifacts/rec-admin/commit/acd995006be758cda59c6452d6b8d6dc4636fe4d))
* **lemonway:** fixed lemonway tabs not beeing selected ([575e8ba](https://github.com/QbitArtifacts/rec-admin/commit/575e8baf0748403f90c610e0e01eaa7f7d7ada66))
* **lemonway:** fixed tabs not beeing selected on first load ([a40e7fb](https://github.com/QbitArtifacts/rec-admin/commit/a40e7fbb6c5875dc800bd8be3d5c8f0eaca83b2f))
* trivial ([d8c9d77](https://github.com/QbitArtifacts/rec-admin/commit/d8c9d773126ff89d067c6bbf86e66454681382af))
* **lemonway:** trivial ([6df4114](https://github.com/QbitArtifacts/rec-admin/commit/6df41149e52c0fe80676599783a1282966f74975))
* **login:** removed unused code ([91cd6be](https://github.com/QbitArtifacts/rec-admin/commit/91cd6be13062148994c1e3d5b51c42577b4c810c))
* **mailing:** Save mail on send - fixes QbitArtifacts/rec-issues/issues/81 ([2cf9e44](https://github.com/QbitArtifacts/rec-admin/commit/2cf9e44bcf7e6578bb23432055c6f93d8f054ab5))
* **perf:** optimized first load ([cd9e153](https://github.com/QbitArtifacts/rec-admin/commit/cd9e15311e425eddcf17aea2ff8f109566fbeadd))
* **styles:** fixed some styles in lemonway tab ([66f3b1c](https://github.com/QbitArtifacts/rec-admin/commit/66f3b1cc5dd4a9888099baa7e2e08f1c9420d51c))
* **ui:** added icon-button component ([2690bac](https://github.com/QbitArtifacts/rec-admin/commit/2690bacaf2811684a971d8ee9690591cff8d228e))

### [3.4.11](https://github.com/QbitArtifacts/rec-admin/compare/v3.4.10...v3.4.11) (2019-11-13)


### Bug Fixes

* **docs:** fixed commiting section in README ([ba4b9fc](https://github.com/QbitArtifacts/rec-admin/commit/ba4b9fc1acb412e695411533031e80d4b98fddf1))
* **docs:** fixed commiting section in README ([601c522](https://github.com/QbitArtifacts/rec-admin/commit/601c522fe1fcb8b785dd71b327d268fd6def7440))

### 3.4.10 (2019-11-13)


### Bug Fixes

* **Account:** fixed  balance not shown ([9e5ff62](https://github.com/QbitArtifacts/rec-admin/commit/9e5ff6297c4730195a42b1803c017cecca442da0))
* **Accounts:** fixed amount not shown ([10ec31f](https://github.com/QbitArtifacts/rec-admin/commit/10ec31f322cc0c7b92fc6e890452e287a4b0e77d))
* **Accounts:** if only one account found not beeing mapped correctly ([f171709](https://github.com/QbitArtifacts/rec-admin/commit/f171709bc308a9e2de02a5b7b752a3182263f2a8))
* **Accounts:** using old find account endpoint ([b95ef2a](https://github.com/QbitArtifacts/rec-admin/commit/b95ef2a414e895be853722e6db2e98dba5c85f82))
* **Accounts:** using old find account endpoint ([b2ee3ba](https://github.com/QbitArtifacts/rec-admin/commit/b2ee3bae9d26dd2bcb3a990b7ee3ae537d2b6336))
* **change_delegated:** removed pan validation and just show PRIVATE accounts ([91c9599](https://github.com/QbitArtifacts/rec-admin/commit/91c9599e660595e57572d2c2796dbe8c806ae783))
* **dashboard:** refresh buttons partially covered by chart ([1848253](https://github.com/QbitArtifacts/rec-admin/commit/18482538dd6768f5b02b790b17e4db0902be4944))
* **EditAccount:** added real search to edit account products ([bddd1dd](https://github.com/QbitArtifacts/rec-admin/commit/bddd1dda547f8e90728c89ec7e8c8d4c7c388c9b))
* **mailing:** fixed cancel mail sending status created and must be cancelled ([2b1d2ef](https://github.com/QbitArtifacts/rec-admin/commit/2b1d2ef447d08b7800e570de3d86bdd15a7beea2))
* **products:** fixed sorting, uncheck unrevisedFirst if sorting other headers ([b4c469b](https://github.com/QbitArtifacts/rec-admin/commit/b4c469b80ab7c08e5a203dffdde03e362ab46bc4))
