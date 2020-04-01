# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.15.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.14.0...v3.15.0) (2020-04-01)


### Features

* **Mailing:** added import accounts from csv and some minor fixes ([68f9812](https://github.com/QbitArtifacts/rec-admin/commit/68f98128f027e88d2f46128717c60c9ccb98cf14))
* mocked TPV tab page in accounts fixes [#189](https://github.com/QbitArtifacts/rec-admin/issues/189) ([#196](https://github.com/QbitArtifacts/rec-admin/issues/196)) ([98890d2](https://github.com/QbitArtifacts/rec-admin/commit/98890d29251c8a35dd337fe1e962552fc64769ce))


### Bug Fixes

* added Amount (eur) to w2w so admins don't think they are sending recs -- and removed sw for now ([a5896b8](https://github.com/QbitArtifacts/rec-admin/commit/a5896b81682b6d76511d60b1c5ce83875f53ad77))
* added Amount (eur) to withdrawal so admins don't think they are sending recs ([fb180d8](https://github.com/QbitArtifacts/rec-admin/commit/fb180d89938f6ac04bd0a239b0d5b25872a49db8))
* **Mailing:** fixed [#184](https://github.com/QbitArtifacts/rec-admin/issues/184) [#183](https://github.com/QbitArtifacts/rec-admin/issues/183) [#182](https://github.com/QbitArtifacts/rec-admin/issues/182) [#185](https://github.com/QbitArtifacts/rec-admin/issues/185) ([00d8c7f](https://github.com/QbitArtifacts/rec-admin/commit/00d8c7f9d9983f4c5282bd0f683102b9886e5016))
* fixed some mailing issues: fixes [#181](https://github.com/QbitArtifacts/rec-admin/issues/181) [#187](https://github.com/QbitArtifacts/rec-admin/issues/187) [#186](https://github.com/QbitArtifacts/rec-admin/issues/186) ([8ec95af](https://github.com/QbitArtifacts/rec-admin/commit/8ec95afd555c29f484f90f0138994031be778b26))
* return to mailing list after clicking on save draft (changes dialog) ([58f3cb6](https://github.com/QbitArtifacts/rec-admin/commit/58f3cb62d7bbade5b638e1da2e2dbceff32eba40))
* **Mailing:** show validation errors on send mail ([89c06d1](https://github.com/QbitArtifacts/rec-admin/commit/89c06d10c73a16a643ad28033852f6db7c968ae8))

## [3.14.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.13.3...v3.14.0) (2020-03-25)


### Features

* added api version to login ([77fb3ed](https://github.com/QbitArtifacts/rec-admin/commit/77fb3ed625a8a8343aa7df18eac5b779cd7eb9ee))
* added api version to sidemenu ([18d35f4](https://github.com/QbitArtifacts/rec-admin/commit/18d35f42be5912ea76dac86e36cca05e5dfd0a5f))


### Bug Fixes

* **Tier:** Edit tier error, now cleaned object and added edit diff to not send if no changes made - fixes [#177](https://github.com/QbitArtifacts/rec-admin/issues/177) ([16d43fd](https://github.com/QbitArtifacts/rec-admin/commit/16d43fd3efe893df84adb9f33f9712ba320bffe6))
* edit document not setting data correctly, fixes [#172](https://github.com/QbitArtifacts/rec-admin/issues/172) ([b290151](https://github.com/QbitArtifacts/rec-admin/commit/b2901512382742efb610265184fbce11a3e1009f))
* tier list not showing parent tier ([685cd80](https://github.com/QbitArtifacts/rec-admin/commit/685cd8061ff4ee593a9d33e12f24dbad354471af))

### [3.13.3](https://github.com/QbitArtifacts/rec-admin/compare/v3.13.2...v3.13.3) (2020-03-24)


### Bug Fixes

* fixed [#109](https://github.com/QbitArtifacts/rec-admin/issues/109) ([#169](https://github.com/QbitArtifacts/rec-admin/issues/169)) ([cd3ce67](https://github.com/QbitArtifacts/rec-admin/commit/cd3ce67633f1661fa5b5812b480bb1c34463bf1c))
* fixes [#167](https://github.com/QbitArtifacts/rec-admin/issues/167) ([#170](https://github.com/QbitArtifacts/rec-admin/issues/170)) ([f940817](https://github.com/QbitArtifacts/rec-admin/commit/f94081744fdd3a771ec7b8ff688cb49908daf0b9))
* sorting documents valid until bad sorting key ([d8e0bc0](https://github.com/QbitArtifacts/rec-admin/commit/d8e0bc0749790669a80c542c285ff390e3f099b3))

### [3.13.2](https://github.com/QbitArtifacts/rec-admin/compare/v3.13.1...v3.13.2) (2020-03-20)


### Bug Fixes

* **tiers:** renamed previous to parent ([#164](https://github.com/QbitArtifacts/rec-admin/issues/164)) ([e854e29](https://github.com/QbitArtifacts/rec-admin/commit/e854e29d95438b10d855ba58a89f60904d6eaaf8))
* added lemon status ([d3c5188](https://github.com/QbitArtifacts/rec-admin/commit/d3c5188553f28a929c7fa4e7b5e7d8c50561478a))
* fixed missing translations for documents ([#162](https://github.com/QbitArtifacts/rec-admin/issues/162)) ([b791f3d](https://github.com/QbitArtifacts/rec-admin/commit/b791f3d2da6e42d7b83e6442635f6b828be9a127))
* fixes issue [#126](https://github.com/QbitArtifacts/rec-admin/issues/126) and issue [#159](https://github.com/QbitArtifacts/rec-admin/issues/159) ([#160](https://github.com/QbitArtifacts/rec-admin/issues/160)) ([2309631](https://github.com/QbitArtifacts/rec-admin/commit/2309631fc5079b146d69a53323f722f775980f8f))
* removed old types from tier ([69c7515](https://github.com/QbitArtifacts/rec-admin/commit/69c7515db52982a6880cddaa78299e9848844bd1))

### [3.13.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.13.0...v3.13.1) (2020-03-10)


### Bug Fixes

* close modal on created ([#158](https://github.com/QbitArtifacts/rec-admin/issues/158)) ([390c6e7](https://github.com/QbitArtifacts/rec-admin/commit/390c6e78ed7eba309f018e67caaa987a7780c45f))

## [3.13.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.12.1+2...v3.13.0) (2020-03-09)


### Features

* improving errors and inputs in create iban ([#157](https://github.com/QbitArtifacts/rec-admin/issues/157)) ([9e57f21](https://github.com/QbitArtifacts/rec-admin/commit/9e57f21dbcc5bddf01bc96ef7c67989785235821))

### [3.12.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.12.0...v3.12.1) (2020-03-04)


### Bug Fixes

* fixed create iban, changed endpoint ([ca3351a](https://github.com/QbitArtifacts/rec-admin/commit/ca3351a33e8a774bcaa204df7f4c522a86982f60))
* removed test step from prod workflow, as it is tested beforehand ([47c39b7](https://github.com/QbitArtifacts/rec-admin/commit/47c39b70412f3dd3ebe5eac8b177ce6b10a08aa5))

## [3.12.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.5...v3.12.0) (2020-03-04)


### Features

* added issue templates ([#150](https://github.com/QbitArtifacts/rec-admin/issues/150)) ([367690b](https://github.com/QbitArtifacts/rec-admin/commit/367690b00f796cc274df524e7073820ae43f7ed2))


### Bug Fixes

* added account_id to create iban, related to [#145](https://github.com/QbitArtifacts/rec-admin/issues/145) ([#152](https://github.com/QbitArtifacts/rec-admin/issues/152)) ([b378ea5](https://github.com/QbitArtifacts/rec-admin/commit/b378ea5a760e72052771aaea25f6c035960314b6))
* fixes [#147](https://github.com/QbitArtifacts/rec-admin/issues/147) -- remove button hidden for lw documents ([#154](https://github.com/QbitArtifacts/rec-admin/issues/154)) ([4dd9a1f](https://github.com/QbitArtifacts/rec-admin/commit/4dd9a1f0c767c9d4468977e1dbda3721ddd21e65))
* fixes [#149](https://github.com/QbitArtifacts/rec-admin/issues/149) -- update lat and lon not working ([#151](https://github.com/QbitArtifacts/rec-admin/issues/151)) ([cc89d95](https://github.com/QbitArtifacts/rec-admin/commit/cc89d950cf383948f49a542015a84e5cd84ddd15))

### [3.11.5](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.2...v3.11.5) (2020-02-25)


### Bug Fixes

* fixed incorrect locale for catalan, and fallback to es if not supported ([86981c3](https://github.com/QbitArtifacts/rec-admin/commit/86981c3b3c4f59b55bd25718e545ede075566462))

### [3.11.4](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.2...v3.11.4) (2020-02-18)


### Bug Fixes

* fixed incorrect locale for `catalan` `ca`, and fallback to `es` if locale is not supported ([86981c3](https://github.com/QbitArtifacts/rec-admin/commit/86981c3b3c4f59b55bd25718e545ede075566462))

### [3.11.3](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.2...v3.11.3) (2020-02-18)

### Deps
* Updated **@angular** to version `v9.0.0`

### Bug Fixes
* Fixed material paginator Intl not working after update


### [3.11.2](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.0...v3.11.2) (2020-02-07)


### Bug Fixes

* error creating non lemonway document kind fixes [#132](https://github.com/QbitArtifacts/rec-admin/issues/132) ([33dac44](https://github.com/QbitArtifacts/rec-admin/commit/33dac44c43400ea0399a694e873fa37b33d77066))
* **Entities/Tiers:** edit after creating tier not working ([8826895](https://github.com/QbitArtifacts/rec-admin/commit/8826895f2a886df1a5632c8068dcee7272f34ea9))
* fixed cant delete normal document fixes [#135](https://github.com/QbitArtifacts/rec-admin/issues/135) ([3e5c082](https://github.com/QbitArtifacts/rec-admin/commit/3e5c082a95895023db90da8b4deb62c3ecfddba7))
* fixed edit tier button not closing modal, fixes [#137](https://github.com/QbitArtifacts/rec-admin/issues/137) ([46499e6](https://github.com/QbitArtifacts/rec-admin/commit/46499e684cc6132cbecafb7ef4972da7283d5375))
* fixed manifest images ([ad62697](https://github.com/QbitArtifacts/rec-admin/commit/ad6269712b94590fbbaac1d5f245bd4d47a9bd3f))
* fixed manifest images ([5ce5371](https://github.com/QbitArtifacts/rec-admin/commit/5ce5371990752f073b9130c282830e2e074f0361))
* made table list buttons cell non clickable ([4481b66](https://github.com/QbitArtifacts/rec-admin/commit/4481b66f83533329aed1633dce43406ef8656437))
* removed some manifest image paths ([14b9153](https://github.com/QbitArtifacts/rec-admin/commit/14b9153ab16fe841ca84996a1aeaab2f8b62eeee))
* show only verified tiers and next one fixes [#130](https://github.com/QbitArtifacts/rec-admin/issues/130) ([ce1599d](https://github.com/QbitArtifacts/rec-admin/commit/ce1599d4046dd7d608097cf9bce05937a20e7ab0))
* some code cleanup ([df7d790](https://github.com/QbitArtifacts/rec-admin/commit/df7d7909ac613674a5a36f905d4cfaeb6d4f81a1))

### [3.11.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.11.0...v3.11.1) (2020-02-03)


### Bug Fixes

* some code cleanup ([df7d790](https://github.com/QbitArtifacts/rec-admin/commit/df7d7909ac613674a5a36f905d4cfaeb6d4f81a1))

## [3.11.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.4...v3.11.0) (2020-01-31)


### Features

* made table rows clickable ([4b30d48](https://github.com/QbitArtifacts/rec-admin/commit/4b30d481b546cf8dd5c7bf0f247eb56aa30dbb0a))


### Bug Fixes

* build error ([3251e9f](https://github.com/QbitArtifacts/rec-admin/commit/3251e9faf414b95a1bcdd8b20aaf4834791a99c8))
* fixed bug with sidemenu navigation ([4d166ff](https://github.com/QbitArtifacts/rec-admin/commit/4d166ff3fb6febecb7106903b49b5437b79aa6a1))
* fixed build ([df540ff](https://github.com/QbitArtifacts/rec-admin/commit/df540ffc873d6bbb9f5ceffca2358a4272349268))
* fixed build, bad dependencies ([961078d](https://github.com/QbitArtifacts/rec-admin/commit/961078d912098b72c80794c0917f26e556edf68b))
* fixed changed phone error, wait to show other messages ([f624d70](https://github.com/QbitArtifacts/rec-admin/commit/f624d707197df3d3447c5a02a3e2d38f1e99b0e3))
* fixed undefined properties ([2c51bcc](https://github.com/QbitArtifacts/rec-admin/commit/2c51bccedda849f338e605180908e013307b6fad))
* fixed wallet markup ([36bed0b](https://github.com/QbitArtifacts/rec-admin/commit/36bed0bc4e43351db86e65e71ebb4092eefc563d))
* Fixed when saving user, if phone has error it saves all data and ignores error ([e2db7bd](https://github.com/QbitArtifacts/rec-admin/commit/e2db7bd5074eebba5e7646598af5eb7def948fc5))

### [3.10.4](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.3...v3.10.4) (2020-01-14)
### [3.10.3](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.2...v3.10.3) (2020-01-08)


### Bug Fixes

* fixed money out not listing on first load, [#82](https://github.com/QbitArtifacts/rec-admin/issues/82) ([2d2a6da](https://github.com/QbitArtifacts/rec-admin/commit/2d2a6da75eeea0543aea823bf10b4cdcf54aa44e))
* fixed money out transactions not beeing fetched, nto sending id ([9d262de](https://github.com/QbitArtifacts/rec-admin/commit/9d262def2821e81e3a295e6ac336e3a50e316b54))
* **Account:** fixed text for active account checkbox  [#95](https://github.com/QbitArtifacts/rec-admin/issues/95) ([9c4e1fc](https://github.com/QbitArtifacts/rec-admin/commit/9c4e1fce8c13305d5a77ae20f75c3a069f262d8b))
* fixed search behaving in a weird way, cancel previous calls [#94](https://github.com/QbitArtifacts/rec-admin/issues/94) ([8ea332d](https://github.com/QbitArtifacts/rec-admin/commit/8ea332df1b0fe97d2281fd278e2a011bde247559))

### [3.10.2](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.1...v3.10.2) (2020-01-07)

### Bug Fixes

* fixed money out not listing on first load, [#82](https://github.com/QbitArtifacts/rec-admin/issues/82) ([2d2a6da](https://github.com/QbitArtifacts/rec-admin/commit/2d2a6da75eeea0543aea823bf10b4cdcf54aa44e))
* fixed money out transactions not beeing fetched, nto sending id ([9d262de](https://github.com/QbitArtifacts/rec-admin/commit/9d262def2821e81e3a295e6ac336e3a50e316b54))
* **Account:** fixed text for active account checkbox  [#95](https://github.com/QbitArtifacts/rec-admin/issues/95) ([9c4e1fc](https://github.com/QbitArtifacts/rec-admin/commit/9c4e1fce8c13305d5a77ae20f75c3a069f262d8b))
* fixed search behaving in a weird way, cancel previous calls [#94](https://github.com/QbitArtifacts/rec-admin/issues/94) ([8ea332d](https://github.com/QbitArtifacts/rec-admin/commit/8ea332df1b0fe97d2281fd278e2a011bde247559))

### [3.10.2](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.1...v3.10.2) (2020-01-07)

### Bug Fixes

* limitted show christmas light just to christmas weeks ([2ec4888](https://github.com/QbitArtifacts/rec-admin/commit/2ec4888bbdf04f1944845a48fc58e5afc679f240))

### [3.10.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.10.0...v3.10.1) (2019-12-31)


### Bug Fixes

* **accounts:** Fixed account details not updating after update, [#89](https://github.com/QbitArtifacts/rec-admin/issues/89) ([c4c4d48](https://github.com/QbitArtifacts/rec-admin/commit/c4c4d4804c2270adb98c479f3ad0971e4712d270))
* **lemonway:** removed iban list from lemonway tabs ([a27163e](https://github.com/QbitArtifacts/rec-admin/commit/a27163ec465d239d3b2e2a04aa86864b38eef4f0))
* **w2w:** fixed wallet 2 wallet not updating balances on select account fixes [#83](https://github.com/QbitArtifacts/rec-admin/issues/83) ([46373b6](https://github.com/QbitArtifacts/rec-admin/commit/46373b66c96224893d6865050902efc4c533fba8))


## [3.10.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.8.1...v3.10.0) (2019-12-27)


### Features

* added add-iban dialog ([d6354cd](https://github.com/QbitArtifacts/rec-admin/commit/d6354cd162f2d351debb75e4adfd72fb58ed7ad0), [f8bd779](https://github.com/QbitArtifacts/rec-admin/commit/f8bd779a2d7b0bd1675362fcbb9cdc72a95777cf))
* added create iban buttons and overall logic ([336a310](https://github.com/QbitArtifacts/rec-admin/commit/336a3107d67fe593736bdb164048662797adce39), [47144bc](https://github.com/QbitArtifacts/rec-admin/commit/47144bc1d68c36fb1c251d1ffea1603e3bd01baa))
* added lemonway iban list to lemonway info, added EventsService to be able to register and dispatch events across the whole app ([316bcd5](https://github.com/QbitArtifacts/rec-admin/commit/316bcd596ce23af8b007cc08737cd077b35ccb57), [ad88856](https://github.com/QbitArtifacts/rec-admin/commit/ad888560df949a2c729579a2435bb7376080b90c))


### Bug Fixes

* **money-out:** fixed money out status showing undefined ([c4569cb](https://github.com/QbitArtifacts/rec-admin/commit/c4569cb7f5cbe8288b62a3aad48d39312a6d635f),[8bc0a67](https://github.com/QbitArtifacts/rec-admin/commit/8bc0a671d2b1f8b494ac6d95a24e9320be7a79b4))
* added missing property itemType ([b0d0c6a](https://github.com/QbitArtifacts/rec-admin/commit/b0d0c6a5ce48244d39cafa182f13155f825b2114),[bb0e944](https://github.com/QbitArtifacts/rec-admin/commit/bb0e9448104522f99b47b0c9aa9cb1848e376bf2))
* fixed build error, undeclared functions in lemonway tabs ([5873636](https://github.com/QbitArtifacts/rec-admin/commit/5873636b9379b5bfce5eb599ad3c66b7c8983eba,[db46642](https://github.com/QbitArtifacts/rec-admin/commit/db46642534b57c3ecf296d8d8ea18eb924dc5f6d))
* fixes [#84](https://github.com/QbitArtifacts/rec-admin/issues/84) fixes [#82](https://github.com/QbitArtifacts/rec-admin/issues/82) fixes [#81](https://github.com/QbitArtifacts/rec-admin/issues/81) ([3e3c53b](https://github.com/QbitArtifacts/rec-admin/commit/3e3c53b10b762e2507ae4a8499456021c46c0524))
* removed company filter from cashout fixes [#85](https://github.com/QbitArtifacts/rec-admin/issues/85) ([e3d0984](https://github.com/QbitArtifacts/rec-admin/commit/e3d0984588ddf90818f7319cfc669a7f63181a91))

## [3.9.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.8.1...v3.9.0) (2019-12-19)


### Features

* added add-iban dialog ([d6354cd](https://github.com/QbitArtifacts/rec-admin/commit/d6354cd162f2d351debb75e4adfd72fb58ed7ad0))
* added create iban buttons and overall logic ([47144bc](https://github.com/QbitArtifacts/rec-admin/commit/47144bc1d68c36fb1c251d1ffea1603e3bd01baa))
* added lemonway iban list to lemonway info, added EventsService to be able to register and dispatch events across the whole app ([ad88856](https://github.com/QbitArtifacts/rec-admin/commit/ad888560df949a2c729579a2435bb7376080b90c))


### Bug Fixes

* **money-out:** fixed money out status showing undefined ([8bc0a67](https://github.com/QbitArtifacts/rec-admin/commit/8bc0a671d2b1f8b494ac6d95a24e9320be7a79b4))
* added missing property itemType ([bb0e944](https://github.com/QbitArtifacts/rec-admin/commit/bb0e9448104522f99b47b0c9aa9cb1848e376bf2))
* fixed build error, undeclared functions in lemonway tabs ([db46642](https://github.com/QbitArtifacts/rec-admin/commit/db46642534b57c3ecf296d8d8ea18eb924dc5f6d))

### [3.8.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.8.0...v3.8.1) (2019-12-18)


### Bug Fixes

* fixed lemonway IBAN_STATUS_MAP was missing ([da14cf3](https://github.com/QbitArtifacts/rec-admin/commit/da14cf3c434a010d43d448afc7c1de32b99eab0a))

## [3.8.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.7.0...v3.8.0) (2019-12-18)
### Bug Fixes

* added full date tooltip to table:date column ([4d0fd05](https://github.com/QbitArtifacts/rec-admin/commit/4d0fd054a37f2e83f8ab7457645f7f619ef98382))
* added version to login footer ([cf6ceb5](https://github.com/QbitArtifacts/rec-admin/commit/cf6ceb5f96925323221b9667b269d77293bb6098))
* **cash-out:** fixed cashout texts ([7d9c56f](https://github.com/QbitArtifacts/rec-admin/commit/7d9c56fad452c09ccdb7d2dede67bcc777468cdc))
* fixed account picker text was behaving weird, made input debounced, to prevent un-needed updated ([82425ce](https://github.com/QbitArtifacts/rec-admin/commit/82425ceacc4e28f7b9566725a5f7badea03aa5a7))
* **lemonway:** added iban status to lemonway status page ([dc07310](https://github.com/QbitArtifacts/rec-admin/commit/dc07310281471575e97fa4f15a8f0a1a28a48cff))
* fixed lemonway add document, needs to upload lemon doc if kind is lemon ([31e36c5](https://github.com/QbitArtifacts/rec-admin/commit/31e36c5ebddd783bf125b206dfcd0401395c774f))
* fixed money out transactions status ([38c3e09](https://github.com/QbitArtifacts/rec-admin/commit/38c3e09ff7affe014e02f97aa702e2936e121d91))
* lemonway id column was messing up other ids ([4376aec](https://github.com/QbitArtifacts/rec-admin/commit/4376aec4cb2e43a5a00a36e491c4c8e592bd4ff6))
* **lemonway:** fixed loading ([3d89274](https://github.com/QbitArtifacts/rec-admin/commit/3d89274f0861fd00de0e191b6e2261d89cc12585))
* **lemonway_w2s:** fixed lemonway wallet 2 wallet table styles, added negative values in red - fixes QbitArtifacts/rec-admin/issues/67 ([7f16c93](https://github.com/QbitArtifacts/rec-admin/commit/7f16c93f3b272b8d27d1920a968e507392c02f88))
* removed footer, added version to header instead ([a5098af](https://github.com/QbitArtifacts/rec-admin/commit/a5098af866d977efa0781833e4682b75a19bb3ca))
* **TableList:** improved loading, and disable/spin refresh icon on load ([98c001b](https://github.com/QbitArtifacts/rec-admin/commit/98c001ba620f479c38e70aca3a656b5c746e2c98))

## [3.7.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.4...v3.7.0) (2019-12-17)


### Features

* added .github workflows ([d861f83](https://github.com/QbitArtifacts/rec-admin/commit/d861f83baab464ac9e9e7bf406ff30706c2f201d))
* **BaseCrudService:** Added cache functionality, crud services can cache data ([71a4446](https://github.com/QbitArtifacts/rec-admin/commit/71a4446c7b19481db023802a640c6c326751c6df))
* **Lemonway:** implemented api call for withdrawal ([7e02214](https://github.com/QbitArtifacts/rec-admin/commit/7e02214af92067f5caab426e63b3a9a16e22c888))
* improved performance for lights ([5331aec](https://github.com/QbitArtifacts/rec-admin/commit/5331aec142d7c22e76d68b79dde05152f9fa821d))
* improved performance for lights ([f970191](https://github.com/QbitArtifacts/rec-admin/commit/f970191402626298a7be1f61e3198d55425941de))
* preparing Create document, to allow to add lemonway document kinds ([e95bdfe](https://github.com/QbitArtifacts/rec-admin/commit/e95bdfe5695aeab996bdc489a40b9f665da97e59))
* preparing Create document, to allow to add lemonway document kinds ([72df8c1](https://github.com/QbitArtifacts/rec-admin/commit/72df8c144086a20c60563d4d7c38976acc4a6aa7))
* **MoneyOut:** Now can select accounts from selector, and user input id ([ef9c7e5](https://github.com/QbitArtifacts/rec-admin/commit/ef9c7e5ee393d860d3f20602fad8fab8ea46f28b))
* **MoneyOut:** Now can select accounts from selector, and user input id II ([7690fd7](https://github.com/QbitArtifacts/rec-admin/commit/7690fd70b67098331ce8e177e2e5f310ce0ca09a))


### Bug Fixes

* **accounts:** fixed buttons not rendered ([4f3356b](https://github.com/QbitArtifacts/rec-admin/commit/4f3356bb4c008e3271b8b8f41c4bac34ad77569e))
* **BaseTab:** set loading on sortData, to not allow users to sort compulsively ([8307266](https://github.com/QbitArtifacts/rec-admin/commit/830726688e5b7e3545cc2a384547217e79296ddc))
* **deps:** updated sentry to 5.9.1 ([c18b5c4](https://github.com/QbitArtifacts/rec-admin/commit/c18b5c4388dd7713136f55f39642d5da6499d092))
* fixed workflows [skip ci] ([39d9cbc](https://github.com/QbitArtifacts/rec-admin/commit/39d9cbc1b26cc2f4792a1e222fed93ef89c23835))
* **DocumentKind:** hide lemonway toggle if is edit ([f37711f](https://github.com/QbitArtifacts/rec-admin/commit/f37711f741565159b42f09fc81f35715a5b8e5f9))
* **DocumentKind:** hide lemonway toggle if is edit ([743819f](https://github.com/QbitArtifacts/rec-admin/commit/743819ff89aa2234fd1c62780700a7713c591056))
* **documents:** added lemonway validation errors to add document ([5d72f52](https://github.com/QbitArtifacts/rec-admin/commit/5d72f522aeee911103c258d7e3e4542d54c7ba24))
* **entities:** fixed add tier dialog, and added filters ([ecb57e5](https://github.com/QbitArtifacts/rec-admin/commit/ecb57e5c457ed152fbd8d06037a4f7de143de113))
* **entities:** fixing tier->document_kind relation ([f525917](https://github.com/QbitArtifacts/rec-admin/commit/f5259173b90240b10761260aefcb790c77a68b60))
* **Entities:Documents:** added kind and status ([cb06b23](https://github.com/QbitArtifacts/rec-admin/commit/cb06b239cad9e2ad2f3ebb1b2d8fdce9739e7472))
* fixed workflows [skip ci] ([d9c458b](https://github.com/QbitArtifacts/rec-admin/commit/d9c458b3ebaa14264984e888ad2543e71d8b5e54))
* **Entities:Documents:** fixed creation modal, and added some more fields ([f5fdc63](https://github.com/QbitArtifacts/rec-admin/commit/f5fdc6339e64ed0f7e06d0d9af24c3c982029191))
*  some fixed to entities tabs ([0d5ee3c](https://github.com/QbitArtifacts/rec-admin/commit/0d5ee3c902abd2d4e1a20f9edb1d94576d76eda8))
* added tier to edit account ([c213e6b](https://github.com/QbitArtifacts/rec-admin/commit/c213e6bf45eb406238c1a16e3d014eeb6e75ef5a))
* added validate tier from account documents & tiers ([59c7b11](https://github.com/QbitArtifacts/rec-admin/commit/59c7b1107adc136f95ff1b83c62d3995a1f0160e))
* added warning alert for lemonway wallet 2 wallet ([ba13a0f](https://github.com/QbitArtifacts/rec-admin/commit/ba13a0fbddd5041695e5aa029c52fe608ba08aab))
* changed lemonway wallet 2 wallet alert message, and added translations ([867aec5](https://github.com/QbitArtifacts/rec-admin/commit/867aec5011316c027ee4756ed4462b43a4fc212d))
* dashboard charts, round y-label value ([2204e6d](https://github.com/QbitArtifacts/rec-admin/commit/2204e6dd1e99dc93ca7901baaa16934da8665b45))
* dashboard charts, round y-label value ([f29d7a6](https://github.com/QbitArtifacts/rec-admin/commit/f29d7a68893f0b1aa7b50fe836455334b57cccdf))
* finishing Tier stuff ([9030e2b](https://github.com/QbitArtifacts/rec-admin/commit/9030e2bdd455e41bbc72cb371678e2c9ba1f3209))
* fixed build error ([1880df7](https://github.com/QbitArtifacts/rec-admin/commit/1880df7ed4c2f3b0cf03829e883cacd30b5abe27))
* fixed merge issues ([37b1a09](https://github.com/QbitArtifacts/rec-admin/commit/37b1a091ff67946417d0d84f1f08d5c9edeab1a7))
* fixed TlHeaders.Avatar sort header ([7eeb89d](https://github.com/QbitArtifacts/rec-admin/commit/7eeb89d4092086fa934fd15549994574f69b8aac))
* fixed weird behaviour with lemon wallet 2 wallet ([c6dbd31](https://github.com/QbitArtifacts/rec-admin/commit/c6dbd31fbc88af184fa98d19e2f56453178f33f4))
* fixed weird behaviour with lemon wallet 2 wallet ([552354c](https://github.com/QbitArtifacts/rec-admin/commit/552354c27eba0cd57e1af57c64f6b686b98b72fe))
* fixed workflows ([b0ee3d4](https://github.com/QbitArtifacts/rec-admin/commit/b0ee3d4dcf5014daab57b6ac586bbd1efab8e5d8))
* fixed workflows ([f7a22db](https://github.com/QbitArtifacts/rec-admin/commit/f7a22dbacb52b0c99db66988f33ae0e865bac028))
* fixed workflows ([a31b1b7](https://github.com/QbitArtifacts/rec-admin/commit/a31b1b76d8ffcab0558b567cf45e1bab90295e2c))
* fixed workflows ([ec623e0](https://github.com/QbitArtifacts/rec-admin/commit/ec623e09fa685314e618061dde32e139ab1a565b))
* fixed workflows ([b09ce2f](https://github.com/QbitArtifacts/rec-admin/commit/b09ce2f2e20552dae17ece89ec723131e9b895df))
* fixed workflows ([64801fc](https://github.com/QbitArtifacts/rec-admin/commit/64801fc7cf921b63300d24afae4fdf268e653acf))
* fixed workflows ([5e6b3d1](https://github.com/QbitArtifacts/rec-admin/commit/5e6b3d11b3106d4205ad86c301e4fc24569948b8))
* fixed workflows ([c072113](https://github.com/QbitArtifacts/rec-admin/commit/c072113342772eeac8104ba17abd02ca0f7a744f))
* fixed workflows ([ec5b4d9](https://github.com/QbitArtifacts/rec-admin/commit/ec5b4d9a664b5522f0c943907c13bea82ec412dc))
* fixed workflows [skip ci] ([209a0f3](https://github.com/QbitArtifacts/rec-admin/commit/209a0f3044553bbe2f8032b8261aec9361b62f92))
* fixed workflows [skip ci] ([a128db1](https://github.com/QbitArtifacts/rec-admin/commit/a128db10b8043748b6e5b8aeb79c69ac32368f7c))
* fixed workflows [skip ci] ([370a06a](https://github.com/QbitArtifacts/rec-admin/commit/370a06a5b2ea0c28ea5e29c31edb3c5e01fb3055))
* fixed workflows [skip ci] ([0614379](https://github.com/QbitArtifacts/rec-admin/commit/0614379aca875bc1f683ea55e8ab0ce1b6ffbb1c))
* fixed workflows [skip ci] ([9e33e07](https://github.com/QbitArtifacts/rec-admin/commit/9e33e0746337a277a777dad84c6b1d58022782be))
* fixed workflows [skip ci] ([91bda17](https://github.com/QbitArtifacts/rec-admin/commit/91bda177d681b4c8b2f98a4aa4dc7d63b53f3843))
* fixed workflows [skip ci] ([18ab421](https://github.com/QbitArtifacts/rec-admin/commit/18ab4217a80c8a196367195272dc63aab0c3d5c5))
* footer in account tabs was not always visible ([b566fb3](https://github.com/QbitArtifacts/rec-admin/commit/b566fb3d9ccb35dd2a30c874c66ed3f78af3bed4))
* footer in account tabs was not always visible ([4400796](https://github.com/QbitArtifacts/rec-admin/commit/4400796a1b2fe7a7d96296dc0dc74098cd282dd3))
* implementing tiers and docs ([7dff446](https://github.com/QbitArtifacts/rec-admin/commit/7dff446485fb72a252dd7204972ad500544081d6))
* mark tiers as validated if already set in account ([652ab9d](https://github.com/QbitArtifacts/rec-admin/commit/652ab9dda8f5f9e686021aee7516f7cd84fde17b))
* moved components/dialogs to dialogs/ ([49325b8](https://github.com/QbitArtifacts/rec-admin/commit/49325b89c4abc2b561bf4e3912501acf0d094dec))
* removed code smell in login ([280700f](https://github.com/QbitArtifacts/rec-admin/commit/280700f179baf7bcf202f487be4d2c89b007a57d))
* removed code smell in login ([9d07e44](https://github.com/QbitArtifacts/rec-admin/commit/9d07e447f689aaae68a83e67a7694e1f1e64b30f))
* removed sort from account table 'amount' ([7df8e61](https://github.com/QbitArtifacts/rec-admin/commit/7df8e6102843a63fc79d5632507aedb077612934))
* removed unused file ([e8eeba4](https://github.com/QbitArtifacts/rec-admin/commit/e8eeba4799766bffcbed9f7f8e35beb99daa1ec9))
* try fix sort tiers error, if no previous ([1e953cf](https://github.com/QbitArtifacts/rec-admin/commit/1e953cf712c57a8dc47aaac973dc390e7e4ef6d5))
* try fix sort tiers error, if no previous ([7e0911b](https://github.com/QbitArtifacts/rec-admin/commit/7e0911b2c682657b56b3e2a4ff2ce57bd925b133))
* **Entities:Documents:** Fixed table breaking if no account passed in ([35ccf14](https://github.com/QbitArtifacts/rec-admin/commit/35ccf141c76375f819ff7b4740b323d4761c1243))
* **i18:** added translations for new entities ([e391d28](https://github.com/QbitArtifacts/rec-admin/commit/e391d2818091f19b47b734d520d37e5818e97630))
* **lemonway:** fixed lemonway concept messages not shown ([578c8d5](https://github.com/QbitArtifacts/rec-admin/commit/578c8d5f8ef902cee7d283209c90a9809b4ca57e))
* **tiers:** added add and remove document kinds, and some minor fixes ([0bd596b](https://github.com/QbitArtifacts/rec-admin/commit/0bd596b7ee24491554bbb27fcd06277c7a966fe7))
* **tl-headers:** fixed tl heaer not searching after query is cleared ([5270f66](https://github.com/QbitArtifacts/rec-admin/commit/5270f66608d21b30e0412112b52a6b73ef7a416c))
* **TlListHeader:** ignoring query on change pagination page ([864edfa](https://github.com/QbitArtifacts/rec-admin/commit/864edfa6031c2853a8f3e24c42f9ba7d0f2103f8))


## [3.6.0](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.4...v3.6.0) (2019-12-12)


### Features

* added .github workflows ([d861f83](https://github.com/QbitArtifacts/rec-admin/commit/d861f83baab464ac9e9e7bf406ff30706c2f201d))
* **BaseCrudService:** Added cache functionality, crud services can cache data ([71a4446](https://github.com/QbitArtifacts/rec-admin/commit/71a4446c7b19481db023802a640c6c326751c6df))
* **Lemonway:** implemented api call for withdrawal ([7e02214](https://github.com/QbitArtifacts/rec-admin/commit/7e02214af92067f5caab426e63b3a9a16e22c888))
* improved performance for lights ([5331aec](https://github.com/QbitArtifacts/rec-admin/commit/5331aec142d7c22e76d68b79dde05152f9fa821d))
* preparing Create document, to allow to add lemonway document kinds ([e95bdfe](https://github.com/QbitArtifacts/rec-admin/commit/e95bdfe5695aeab996bdc489a40b9f665da97e59))
* **MoneyOut:** Now can select accounts from selector, and user input id ([95ede1f](https://github.com/QbitArtifacts/rec-admin/commit/95ede1f29ccd0ce3d760255c01e51e849c76448b))
* **MoneyOut:** Now can select accounts from selector, and user input id II ([eafa99e](https://github.com/QbitArtifacts/rec-admin/commit/eafa99e708d9d441f2bab7b6be7e5a84bd4954cc))
* **TlTableList:** added disable sortable headers globaly ([01f40c2](https://github.com/QbitArtifacts/rec-admin/commit/01f40c2a6de45f28f4f7a8292ab3d89eb736feba))


### Bug Fixes

* **accounts:** fixed buttons not rendered ([4f3356b](https://github.com/QbitArtifacts/rec-admin/commit/4f3356bb4c008e3271b8b8f41c4bac34ad77569e))
* **BaseTab:** set loading on sortData, to not allow users to sort compulsively ([8307266](https://github.com/QbitArtifacts/rec-admin/commit/830726688e5b7e3545cc2a384547217e79296ddc))
* **deps:** updated sentry to 5.9.1 ([c18b5c4](https://github.com/QbitArtifacts/rec-admin/commit/c18b5c4388dd7713136f55f39642d5da6499d092))
* fixed workflows [skip ci] ([9e33e07](https://github.com/QbitArtifacts/rec-admin/commit/9e33e0746337a277a777dad84c6b1d58022782be))
* **DocumentKind:** hide lemonway toggle if is edit ([f37711f](https://github.com/QbitArtifacts/rec-admin/commit/f37711f741565159b42f09fc81f35715a5b8e5f9))
* **DocumentKind:** hide lemonway toggle if is edit ([743819f](https://github.com/QbitArtifacts/rec-admin/commit/743819ff89aa2234fd1c62780700a7713c591056))
* **documents:** added lemonway validation errors to add document ([5d72f52](https://github.com/QbitArtifacts/rec-admin/commit/5d72f522aeee911103c258d7e3e4542d54c7ba24))
* **entities:** fixed add tier dialog, and added filters ([ecb57e5](https://github.com/QbitArtifacts/rec-admin/commit/ecb57e5c457ed152fbd8d06037a4f7de143de113))
* **entities:** fixing tier->document_kind relation ([f525917](https://github.com/QbitArtifacts/rec-admin/commit/f5259173b90240b10761260aefcb790c77a68b60))
* **Entities:Documents:** added kind and status ([cb06b23](https://github.com/QbitArtifacts/rec-admin/commit/cb06b239cad9e2ad2f3ebb1b2d8fdce9739e7472))
* fixed workflows [skip ci] ([209a0f3](https://github.com/QbitArtifacts/rec-admin/commit/209a0f3044553bbe2f8032b8261aec9361b62f92))
* **Entities:Documents:** fixed creation modal, and added some more fields ([f5fdc63](https://github.com/QbitArtifacts/rec-admin/commit/f5fdc6339e64ed0f7e06d0d9af24c3c982029191))
*  some fixed to entities tabs ([0d5ee3c](https://github.com/QbitArtifacts/rec-admin/commit/0d5ee3c902abd2d4e1a20f9edb1d94576d76eda8))
* added tier to edit account ([c213e6b](https://github.com/QbitArtifacts/rec-admin/commit/c213e6bf45eb406238c1a16e3d014eeb6e75ef5a))
* added validate tier from account documents & tiers ([59c7b11](https://github.com/QbitArtifacts/rec-admin/commit/59c7b1107adc136f95ff1b83c62d3995a1f0160e))
* added warning alert for lemonway wallet 2 wallet ([ba13a0f](https://github.com/QbitArtifacts/rec-admin/commit/ba13a0fbddd5041695e5aa029c52fe608ba08aab))
* changed lemonway wallet 2 wallet alert message, and added translations ([867aec5](https://github.com/QbitArtifacts/rec-admin/commit/867aec5011316c027ee4756ed4462b43a4fc212d))
* dashboard charts, round y-label value ([2204e6d](https://github.com/QbitArtifacts/rec-admin/commit/2204e6dd1e99dc93ca7901baaa16934da8665b45))
* dashboard charts, round y-label value ([f29d7a6](https://github.com/QbitArtifacts/rec-admin/commit/f29d7a68893f0b1aa7b50fe836455334b57cccdf))
* finishing Tier stuff ([9030e2b](https://github.com/QbitArtifacts/rec-admin/commit/9030e2bdd455e41bbc72cb371678e2c9ba1f3209))
* fixed build error ([1880df7](https://github.com/QbitArtifacts/rec-admin/commit/1880df7ed4c2f3b0cf03829e883cacd30b5abe27))
* fixed merge issues ([37b1a09](https://github.com/QbitArtifacts/rec-admin/commit/37b1a091ff67946417d0d84f1f08d5c9edeab1a7))
* fixed TlHeaders.Avatar sort header ([7eeb89d](https://github.com/QbitArtifacts/rec-admin/commit/7eeb89d4092086fa934fd15549994574f69b8aac))
* fixed weird behaviour with lemon wallet 2 wallet ([c6dbd31](https://github.com/QbitArtifacts/rec-admin/commit/c6dbd31fbc88af184fa98d19e2f56453178f33f4))
* fixed workflows ([b0ee3d4](https://github.com/QbitArtifacts/rec-admin/commit/b0ee3d4dcf5014daab57b6ac586bbd1efab8e5d8))
* footer in account tabs was not always visible ([4400796](https://github.com/QbitArtifacts/rec-admin/commit/4400796a1b2fe7a7d96296dc0dc74098cd282dd3))
* implementing tiers and docs ([7dff446](https://github.com/QbitArtifacts/rec-admin/commit/7dff446485fb72a252dd7204972ad500544081d6))
* mark tiers as validated if already set in account ([652ab9d](https://github.com/QbitArtifacts/rec-admin/commit/652ab9dda8f5f9e686021aee7516f7cd84fde17b))
* moved components/dialogs to dialogs/ ([49325b8](https://github.com/QbitArtifacts/rec-admin/commit/49325b89c4abc2b561bf4e3912501acf0d094dec))
* removed code smell in login ([9d07e44](https://github.com/QbitArtifacts/rec-admin/commit/9d07e447f689aaae68a83e67a7694e1f1e64b30f))
* removed sort from account table 'amount' ([7df8e61](https://github.com/QbitArtifacts/rec-admin/commit/7df8e6102843a63fc79d5632507aedb077612934))
* removed unused file ([e8eeba4](https://github.com/QbitArtifacts/rec-admin/commit/e8eeba4799766bffcbed9f7f8e35beb99daa1ec9))

### [3.5.3](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.2...v3.5.3) (2019-11-22)

### [3.5.4](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.2...v3.5.4) (2019-12-10)

### [3.5.3](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.2...v3.5.3) (2019-11-22)

### [3.5.2](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.1...v3.5.2) (2019-11-21)


### Bug Fixes

* **table-search:** fixed table search, pagination removed query from request ([a886165](https://github.com/QbitArtifacts/rec-admin/commit/a886165f57aa4778222ba950cf4869c11b3192fb))

### [3.5.1](https://github.com/QbitArtifacts/rec-admin/compare/v3.5.0...v3.5.1) (2019-11-21)


### Bug Fixes

* **accounts:** scale lw_wallet as its returned in cents ([8ac1c29](https://github.com/QbitArtifacts/rec-admin/commit/8ac1c29ab53e185db078626e081e9f6a090d55e3))

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
