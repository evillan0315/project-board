import { type Component, createSignal, For, onMount } from 'solid-js';
import api from '../services/api';

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  scripts?: { [key: string]: string };
  author?: string;
  license?: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  [key: string]: any;
}

const PackageJsonForm: Component = () => {
  const [packageJson, setPackageJson] = createSignal<PackageJson>({});
  const [extraFields, setExtraFields] = createSignal<string[]>([]);
  const [newFieldName, setNewFieldName] = createSignal('');
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const getPackageJson = async () => {
    try {
      const response = await api.post('/file/read', { filePath: './frontend/package.json' });

      if (!response.data) {
        throw new Error('Error getting package.json from API');
      }
      localStorage.setItem('packageJsonData', JSON.stringify(response.data.content));
      console.log(response.data.content, 'response.data.content');
      setPackageJson(JSON.parse(response.data.content));
    } catch (err) {
      console.error('Error generating documentation:', err);
    } finally {
    }
  };

  onMount(async () => {
    try {
      await getPackageJson(); // primary source
    } catch {
      const fallbackData = localStorage.getItem('packageJsonData');
      if (fallbackData) {
        const parsed = JSON.parse(fallbackData);
        setPackageJson(parsed);
        const keys = Object.keys(parsed);
        const knownKeys = [
          'name',
          'version',
          'description',
          'main',
          'scripts',
          'author',
          'license',
          'dependencies',
          'devDependencies',
        ];
        const unknownKeys = keys.filter((key) => !knownKeys.includes(key));
        setExtraFields(unknownKeys);
      } else {
        setErrorMessage('Failed to load package.json from API and localStorage.');
      }
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setPackageJson({ ...packageJson(), [field]: value });
    localStorage.setItem('packageJsonData', JSON.stringify({ ...packageJson(), [field]: value })); // Persist to localstorage on change
  };

  const handleScriptsChange = (scriptName: string, scriptValue: string) => {
    const updatedScripts = { ...packageJson().scripts, [scriptName]: scriptValue };
    setPackageJson({ ...packageJson(), scripts: updatedScripts });
    localStorage.setItem('packageJsonData', JSON.stringify({ ...packageJson(), scripts: updatedScripts }));
  };

  const handleDependencyChange = (dependencyName: string, dependencyVersion: string, isDev: boolean) => {
    const target = isDev ? 'devDependencies' : 'dependencies';
    const updatedDependencies = { ...packageJson()[target], [dependencyName]: dependencyVersion };
    setPackageJson({ ...packageJson(), [target]: updatedDependencies });
    localStorage.setItem('packageJsonData', JSON.stringify({ ...packageJson(), [target]: updatedDependencies }));
  };

  const handleAddScript = () => {
    const newScriptName = prompt('Enter the new script name:');
    if (newScriptName) {
      handleScriptsChange(newScriptName, '');
    }
  };

  const handleAddDependency = (isDev: boolean) => {
    const dependencyName = prompt('Enter the dependency name:');
    if (dependencyName) {
      handleDependencyChange(dependencyName, '', isDev);
    }
  };

  const handleAddExtraField = () => {
    if (newFieldName().trim() !== '') {
      const fieldName = newFieldName().trim();
      setExtraFields([...extraFields(), fieldName]);
      setPackageJson({ ...packageJson(), [fieldName]: '' }); // Initialize value
      setNewFieldName(''); //reset field

      localStorage.setItem('packageJsonData', JSON.stringify({ ...packageJson(), [fieldName]: '' }));
    }
  };

  const handleDeleteExtraField = (fieldToRemove: string) => {
    const updatedExtraFields = extraFields().filter((field) => field !== fieldToRemove);
    setExtraFields(updatedExtraFields);

    const { [fieldToRemove]: removed, ...rest } = packageJson();
    setPackageJson(rest);
    localStorage.setItem('packageJsonData', JSON.stringify(rest));
  };

  return (
    <div class="max-w-4xl mx-auto p-6 space-y-6 shadow-md rounded-lg">
      {errorMessage() && <div class="text-red-600 font-medium">{errorMessage()}</div>}

      <h2 class="text-2xl font-bold">Package.json Editor</h2>

      <div class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label for="name" class="font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              class="border rounded px-3 py-2"
              value={packageJson().name || ''}
              onInput={(e) => handleInputChange('name', e.currentTarget.value)}
            />
          </div>

          <div class="flex flex-col">
            <label for="version" class="font-medium">
              Version:
            </label>
            <input
              type="text"
              id="version"
              class="border rounded px-3 py-2"
              value={packageJson().version || ''}
              onInput={(e) => handleInputChange('version', e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label for="description" class="font-medium">
            Description:
          </label>
          <textarea
            id="description"
            class="border rounded px-3 py-2"
            value={packageJson().description || ''}
            onInput={(e) => handleInputChange('description', e.currentTarget.value)}
          />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="flex flex-col">
            <label for="main" class="font-medium">
              Main:
            </label>
            <input
              type="text"
              id="main"
              class="border rounded px-3 py-2"
              value={packageJson().main || ''}
              onInput={(e) => handleInputChange('main', e.currentTarget.value)}
            />
          </div>

          <div class="flex flex-col">
            <label for="author" class="font-medium">
              Author:
            </label>
            <input
              type="text"
              id="author"
              class="border rounded px-3 py-2"
              value={packageJson().author || ''}
              onInput={(e) => handleInputChange('author', e.currentTarget.value)}
            />
          </div>

          <div class="flex flex-col">
            <label for="license" class="font-medium">
              License:
            </label>
            <input
              type="text"
              id="license"
              class="border rounded px-3 py-2"
              value={packageJson().license || ''}
              onInput={(e) => handleInputChange('license', e.currentTarget.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-semibold flex items-center justify-between">
          Scripts
          <button class="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700" onClick={handleAddScript}>
            Add Script
          </button>
        </h3>
        <div class="space-y-2">
          <For each={Object.keys(packageJson().scripts || {})}>
            {(scriptName) => (
              <div class="flex flex-col">
                <label for={`script-${scriptName}`} class="font-medium">
                  {scriptName}:
                </label>
                <input
                  type="text"
                  id={`script-${scriptName}`}
                  class="border rounded px-3 py-2"
                  value={packageJson().scripts![scriptName] || ''}
                  onInput={(e) => handleScriptsChange(scriptName, e.currentTarget.value)}
                />
              </div>
            )}
          </For>
        </div>
      </div>

      <div>
        <h3 class="border-b border-gray-500/30 pb-4 mt-10 flex items-center justify-between mb-6 text-xl">
          Dependencies
          <button
            class="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => handleAddDependency(false)}
          >
            Add Dependency
          </button>
        </h3>
        <div class="space-y-2">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <For each={Object.keys(packageJson().dependencies || {})}>
              {(dependencyName) => (
                <div class="flex items-center justify-start gap-4">
                  <label for={`dependency-${dependencyName}`} class="font-medium w-1/2">
                    {dependencyName}:
                  </label>
                  <input
                    type="text"
                    id={`dependency-${dependencyName}`}
                    class="border rounded px-3 py-2"
                    value={packageJson().dependencies![dependencyName] || ''}
                    onInput={(e) => handleDependencyChange(dependencyName, e.currentTarget.value, false)}
                  />
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div>
        <h3 class="border-b border-gray-500/30 pb-4 mt-10 flex items-center justify-between mb-6 text-xl">
          Dev Dependencies
          <button
            class="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => handleAddDependency(true)}
          >
            Add Dev Dependency
          </button>
        </h3>
        <div class="space-y-2">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <For each={Object.keys(packageJson().devDependencies || {})}>
              {(dependencyName) => (
                <div class="flex items-center justify-start gap-4">
                  <label for={`dev-dependency-${dependencyName}`} class="font-medium w-1/2">
                    {dependencyName}:
                  </label>
                  <input
                    type="text"
                    id={`dev-dependency-${dependencyName}`}
                    class="border rounded px-3 py-2"
                    value={packageJson().devDependencies![dependencyName] || ''}
                    onInput={(e) => handleDependencyChange(dependencyName, e.currentTarget.value, true)}
                  />
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold">Extra Fields</h3>

        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="New Field Name"
            class="border rounded px-3 py-2"
            value={newFieldName()}
            onInput={(e) => setNewFieldName(e.currentTarget.value)}
          />
          <button class="bg-green-600 px-3 py-1 rounded hover:bg-green-700" onClick={handleAddExtraField}>
            Add Field
          </button>
        </div>

        <div class="space-y-2 mt-4">
          <For each={extraFields()}>
            {(field) => (
              <div class="flex items-center gap-2">
                <label for={`extra-${field}`} class="w-32 font-medium">
                  {field}:
                </label>
                <input
                  type="text"
                  id={`extra-${field}`}
                  class="flex-1 border rounded px-3 py-2"
                  value={packageJson()[field] || ''}
                  onInput={(e) => handleInputChange(field, e.currentTarget.value)}
                />
                <button
                  class="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDeleteExtraField(field)}
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default PackageJsonForm;
