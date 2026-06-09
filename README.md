# JX Shooting Styles

Fork optimizado y simplificado de **bbv-shootingstyles**.

## Qué incluye
- Interfaz NUI mejorada y traducible.
- Locales en `es` y `en`.
- Estilos configurables desde `config.lua`.
- Guardado opcional del estilo seleccionado.
- Comando, keybind y exports.

## Instalación
1. Coloca la carpeta en `resources/[local]/jx-shootingstyles`.
2. Añade `ensure jx-shootingstyles` a tu `server.cfg`.
3. Configura idioma, tecla y estilos en `config.lua` si quieres.

## Uso
- Comando por defecto: `/s_anim`
- Tecla por defecto: `F5`

## Configuración rápida
- `Config.Language = 'es'` o `'en'`
- `Config.CloseOnSelect = true/false`
- `Config.SaveSelectedStyle = true/false`

## Exports
- `exports['jx-shootingstyles']:OpenMenu()`
- `exports['jx-shootingstyles']:CloseMenu()`
- `exports['jx-shootingstyles']:SetStyle(styleId)`
- `exports['jx-shootingstyles']:GetCurrentStyle()`

## Créditos
- Original: BuddyBoyVilla / `bbv-shootingstyles`
- Fork: JX Store
