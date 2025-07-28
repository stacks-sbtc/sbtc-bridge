const validBnsChars = /^[a-z0-9\-_]+$/;
export function isValidBNSName(fullyQualifiedName: string): boolean {
  if (fullyQualifiedName) {
    try {
      const { namespace, name } = decodeFQN(fullyQualifiedName);
      return validBnsChars.test(namespace) && validBnsChars.test(name);
    } catch (error) {
      return false;
    }
  }
  return false;
}

export function decodeFQN(fqdn: string): {
  name: string;
  namespace: string;
  subdomain?: string;
} {
  const nameParts = fqdn.split(".");
  if (nameParts.length != 2) {
    throw new Error("Invalid BNS name");
  }
  return {
    name: nameParts[0],
    namespace: nameParts[1],
  };
}
