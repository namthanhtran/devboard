import Variable from 'common/types/Variables';

export function replaceVariables(url: string, variables: Variable[]) {
  const activeVars = variables.filter((item) => item.enabled);

  let result = url;
  for (const variable of activeVars) {
    const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
    result = result.replace(regex, variable.value);
  }

  return result;
}
