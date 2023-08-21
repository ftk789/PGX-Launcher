module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'icon.ico',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: 'icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: 'icon.png'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: 'icon.png'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

