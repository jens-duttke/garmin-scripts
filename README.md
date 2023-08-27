# Garmin Connect IQ Scripts

A collection of scripts for building Garmin Connect IQ applications within the **Windows** terminal.

It's using the SDK version which is configured in the Connect IQ SDK Manager.

## `package.json` example

```json
{
  "scripts": {
    "build:debug": "npx -y -p=garmin-scripts build --debug",
    "build:beta": "npx -y -p=garmin-scripts build --beta",
    "build:release": "npx -y -p=garmin-scripts build --release",
    "build:simulator": "npx -y -p=garmin-scripts build --simulator fr645m",
    "era:live": "npx -y -p=garmin-scripts era 01234567-89ab-cdef-0123-456789abcdef",
    "era:beta": "npx -y -p=garmin-scripts era fedcba98-7654-3210-fedc-ba9876543210",
    "list-models-by-memory-usage": "npx -y -p=garmin-scripts list-models-by-memory-usage",
    "list-models-by-bits-per-pixel": "npx -y -p=garmin-scripts list-models-by-bits-per-pixel",
    "get-model-by-product-id": "npx -y -p=garmin-scripts get-model-by-product-id 006-B3990-00"
  }
}
```

## Preparations

### `developer_key`

[Create a developer key](https://developer.garmin.com/connect-iq/connect-iq-basics/getting-started/#generatingadeveloperkey) and store it in a file named `developer_key` in the root of your project.

⚠️ Don't upload your key file to a public Git repository. Add this file name to your `.gitignore`!

### `.store`

Create a JSON file named `.store` in the root of your project.

This file can have 3 properties: "release", "beta" and "debug". Each of them represents the application ID which is injected into your `manifest.xml`, if you build of of these versions.

```json
{
    "release": "01234567-89ab-cdef-0123-456789abcdef",
    "beta": "01234567-89ab-cdef-0123-456789abcdef",
    "debug": "01234567-89ab-cdef-0123-456789abcdef"
}
```

If the application ID for a specific version is missing `"00000000-0000-0000-0000-000000000000"` is used.

## Scripts

### Build / Run simulator

```bash
npx -y -p=garmin-scripts build --debug
npx -y -p=garmin-scripts build --beta
npx -y -p=garmin-scripts build --release
npx -y -p=garmin-scripts build --simulator fr645m
```

#### Specify devices for `--debug` and `--simulator`

For `--debug` amd `--simulator` a device can specified. If the device name is omitted, the script will falls back to `fenix7`.

#### Setting of application ID in `manifest.xml`

As described above, the application IDs from the `.store` are injected into the `manifest.xml`, while running a build.
After the build is finished, the ID is unset.

It's important to have atleast `id=""` in the `iq:application` tag of your `manifest.xml`, as this is the place where the ID is injected.

For example:

```xml
<iq:application id="" type="datafield" name="@Strings.AppName" entry="App" launcherIcon="@Drawables.LauncherIcon" minApiLevel="3.0.0">
```

⚠️ Remember not to change or commit this file while the build is running, otherwise the automatic reverting of the ID after the build has been finished could lead to unexpected results.

#### Setting of application name

While compiling using `--debug` and `--beta`, the script will crawl through all XML files and searches for such a tag:

```xml
<string id="AppName">[YOUR APPLICATION NAME]</string>
```

If it find one, it will append `" (debug)"` to the app name string in `--debug` mode, and `" (beta)"` to the app name string in `--beta` mode.

⚠️ Remember not to change or commit these files while the build is running, otherwise the automatic reverting of these changes after the build has been finished could lead to unexpected results.

#### Exclude whole source code files for debugging or in the release

It is possible to include source code files only in debug mode or only in release/beta mode. To achieve this, give the respective files the extension ".debug.mc" or ".release.mc".
In debug mode, `*.release.mc` files will be renamed to `*.release.mc-`, while in release/beta mode `*.debug.mc` filess will be renamed to `*.debug.mc-` to force the compiler to ignore these files.
After the compilation is done, the files are renamed back to their original file name.

This can be helpful to create 2 versions of a module, one with logging of debug information or which mocks data, and one for the release version.

⚠️ Remember not to change or commit files while the build is running, otherwise this renaming could lead to unexpected results.

### Error Reporting Application

```bash
npx -y -p=garmin-scripts era 01234567-89ab-cdef-0123-456789abcdef
```

### List installed models by their memory usage

```bash
npx -y -p=garmin-scripts list-models-by-memory-usage
```

⚠️ Only devices which are installed by the Connect IQ SDK Manager are covered.

### List installed models by their bits per pixel (number of colors)

```bash
npx -y -p=garmin-scripts list-models-by-bits-per-pixel
```

⚠️ Only devices which are installed by the Connect IQ SDK Manager are covered.

### Get model name by Product ID

Error reports may only contain a Product ID. To get it's name, you can use this script.

```bash
npx -y -p=garmin-scripts get-model-by-product-id 006-B3990-00
```

⚠️ Only devices which are installed by the Connect IQ SDK Manager are covered.
