const getDevDependencies = includeTypes => {
  const devDependencies = [`ava`, `tomer`]

  if (includeTypes) {
    devDependencies.push(`typescript`)
  }

  return devDependencies
}

export default getDevDependencies
