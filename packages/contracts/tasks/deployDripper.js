task('deployDripper', 'Deploy Dripper Contract')
  .addParam('manager', 'Pods Configuration Address')
  .addParam('sablier', 'Sablier Address')
  .setAction(async ({ manager, sablier }, hre) => {
    console.log('manager', manager)
    console.log('sablier', sablier)
    const Dripper = await ethers.getContractFactory('Dripper')
    const dripper = await Dripper.deploy(manager, sablier)

    await dripper.deployTransaction.wait(7)

    constructorArguments = [manager, sablier]

    const verifyObj = {
      address: dripper.address,
      constructorArguments
    }
    await hre.run('verify:verify', verifyObj)

    hre.config.tenderly.project = `Pods-Kovan`
    await hre.tenderly.push({ name: 'Dripper', address: dripper.address })

    console.log('Dripper', dripper.address)
    return dripper.address
  })

  
