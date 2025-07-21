const validBnsChars = /^[a-z0-9\-_]+$/;
export function isValidBNSName(fullyQualifiedName: string): boolean {
  if (fullyQualifiedName) {
    const { subdomain, namespace, name } = decodeFQN(fullyQualifiedName);
    // fullyQualifiedName with sub domains are not resolved
    if (subdomain) {
      return false;
    }
    return validBnsChars.test(namespace) && validBnsChars.test(name);
  }
  return false;
}

export function decodeFQN(fqdn: string): {
  name: string;
  namespace: string;
  subdomain?: string;
} {
  const nameParts = fqdn.split(".");
  if (nameParts.length > 2) {
    return {
      subdomain: nameParts[0],
      name: nameParts[1],
      namespace: nameParts[2],
    };
  }
  return {
    name: nameParts[0],
    namespace: nameParts[1],
  };
}
