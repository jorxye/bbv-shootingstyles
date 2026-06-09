# JX Shooting Styles

Fork optimizado de **bbv-shootingstyles**.

## Instalación
1. Borra cualquier versión antigua del recurso.
2. Coloca la carpeta como `jx-shootingstyles`.
3. Añade en `server.cfg`:

```cfg
ensure jx-shootingstyles
```

## Uso
- Comando: `/s_anim`
- Tecla: `F5`

## Configuración
Edita `config.lua`:
- idioma `es` / `en`
- tecla
- colores
- estilos
- guardado automático

## Exports
```lua
exports['jx-shootingstyles']:OpenMenu()
exports['jx-shootingstyles']:CloseMenu()
exports['jx-shootingstyles']:SetStyle(1)
exports['jx-shootingstyles']:GetCurrentStyle()
```

## Créditos
- Original: BuddyBoyVilla / `bbv-shootingstyles`
- Fork: JX Store
