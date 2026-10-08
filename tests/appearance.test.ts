import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultPresets, defaultAppearanceConfig, getActiveThemeColors, getContrastRatio, isAccessibleContrast } from '../src/lib/theme.ts';
import codiaBetaConfig from '../src/config/codia-beta.json' with { type: 'json' };
import type { AppearanceConfig, UserRole, Permission } from '../src/types';

const checkPermission = (role: UserRole, permission: Permission): boolean => {
  const roleData = codiaBetaConfig.roles[role as keyof typeof codiaBetaConfig.roles];
  if (!roleData) return false;
  const perms = (roleData.permissions as string[]) || [];
  return perms.includes('*') || perms.includes(permission);
};

const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;

test('Temas predeterminados: contiene cafe, neutro, oscuro y alto_contraste con códigos HEX válidos', () => {
  const requiredPresets = ['cafe', 'neutro', 'oscuro', 'alto_contraste'] as const;

  for (const presetKey of requiredPresets) {
    const preset = defaultPresets[presetKey];
    assert.ok(preset, `El tema preset '${presetKey}' debe existir`);
    assert.match(preset.primary, hexRegex, `Primary color de ${presetKey} debe ser HEX válido`);
    assert.match(preset.secondary, hexRegex, `Secondary color de ${presetKey} debe ser HEX válido`);
    assert.match(preset.accent, hexRegex, `Accent color de ${presetKey} debe ser HEX válido`);
    assert.match(preset.background, hexRegex, `Background color de ${presetKey} debe ser HEX válido`);
    assert.match(preset.surface, hexRegex, `Surface color de ${presetKey} debe ser HEX válido`);
    assert.match(preset.foreground, hexRegex, `Foreground color de ${presetKey} debe ser HEX válido`);
  }
});

test('Cálculo de contraste WCAG y accesibilidad', () => {
  // Blanco sobre negro debe dar ratio máximo de 21:1
  const maxRatio = getContrastRatio('#000000', '#FFFFFF');
  assert.ok(maxRatio > 20, 'Contraste entre blanco y negro debe ser cercano a 21:1');

  // Alto contraste debe ser accesible (>= 4.5)
  const altoContraste = defaultPresets.alto_contraste;
  const isAccessible = isAccessibleContrast(altoContraste.foreground, altoContraste.background);
  assert.equal(isAccessible, true, 'El tema alto_contraste debe cumplir con WCAG AA');
});

test('Resolución de colores activos en getActiveThemeColors', () => {
  const configPreset: AppearanceConfig = {
    ...defaultAppearanceConfig,
    activeTheme: 'neutro'
  };
  const colorsNeutro = getActiveThemeColors(configPreset);
  assert.equal(colorsNeutro.primary, defaultPresets.neutro.primary);

  const customTestColors = {
    primary: '#112233',
    secondary: '#445566',
    accent: '#778899',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    foreground: '#000000',
    button: '#112233'
  };

  const configCustom: AppearanceConfig = {
    ...defaultAppearanceConfig,
    activeTheme: 'personalizado',
    customColors: customTestColors
  };
  const colorsCustom = getActiveThemeColors(configCustom);
  assert.equal(colorsCustom.primary, '#112233');
  assert.equal(colorsCustom.secondary, '#445566');
});

test('Control de acceso: solo Administrador y Superadmin pueden modificar configuración visual (settings.manage)', () => {
  assert.equal(checkPermission('superadmin', 'settings.manage'), true);
  assert.equal(checkPermission('administrador', 'settings.manage'), true);

  // Roles restringidos
  assert.equal(checkPermission('encargado', 'settings.manage'), false);
  assert.equal(checkPermission('empleado', 'settings.manage'), false);
  assert.equal(checkPermission('cliente', 'settings.manage'), false);
});
