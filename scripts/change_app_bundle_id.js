const fs = require('fs');
const path = require('path');

const iosProjectPath = path.join(
  __dirname,
  '../ios/SkillCat.xcodeproj/project.pbxproj',
);
const androidManifestPath = path.join(
  __dirname,
  '../android/app/src/main/AndroidManifest.xml',
);
const androidBuildGradlePath = path.join(
  __dirname,
  '../android/app/build.gradle',
);

const newBundleIdentifier = 'com.skillcatapp.skillcat';
const newPackageName = 'com.skillcat';

// Update iOS bundle identifier
const updateIOSBundleIdentifier = () => {
  try {
    let projectContent = fs.readFileSync(iosProjectPath, 'utf8');
    projectContent = projectContent.replace(
      /PRODUCT_BUNDLE_IDENTIFIER = .*;/g,
      `PRODUCT_BUNDLE_IDENTIFIER = ${newBundleIdentifier};`,
    );
    fs.writeFileSync(iosProjectPath, projectContent, 'utf8');
    console.log('iOS bundle identifier updated successfully.');
  } catch (error) {
    console.error('Error updating iOS bundle identifier:', error);
  }
};

// Update Android package name in AndroidManifest.xml
const updateAndroidManifest = () => {
  try {
    let manifestContent = fs.readFileSync(androidManifestPath, 'utf8');
    manifestContent = manifestContent.replace(
      /package="[^"]+"/,
      `package="${newPackageName}"`,
    );
    fs.writeFileSync(androidManifestPath, manifestContent, 'utf8');
    console.log(
      'Android package name in AndroidManifest.xml updated successfully.',
    );
  } catch (error) {
    console.error(
      'Error updating Android package name in AndroidManifest.xml:',
      error,
    );
  }
};

// Update Android package name in build.gradle
const updateAndroidBuildGradle = () => {
  try {
    let buildGradleContent = fs.readFileSync(androidBuildGradlePath, 'utf8');
    buildGradleContent = buildGradleContent.replace(
      /applicationId ".*"/,
      `applicationId "${newPackageName}"`,
    );
    fs.writeFileSync(androidBuildGradlePath, buildGradleContent, 'utf8');
    console.log('Android applicationId in build.gradle updated successfully.');
  } catch (error) {
    console.error(
      'Error updating Android applicationId in build.gradle:',
      error,
    );
  }
};

// Execute updates
updateIOSBundleIdentifier();
updateAndroidManifest();
updateAndroidBuildGradle();
