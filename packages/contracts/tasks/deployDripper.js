task('deployDripper', 'Deploy Dripper Contract')
  .addParam('manager', 'Pods Configuration Address')
  .addParam('sablier', 'Sablier Address')
  .setAction(async ({ manager, sablier }, hre) => {
    console.log('manager', manager)
    console.log('sablier', sablier)
    const Dripper = await ethers.getContractFactory('Dripper')
    const dripper = await Dripper.deploy(manager, sablier)

    await dripper.deployed()

    console.log('Dripper', dripper.address)
    return dripper.address
  })

  
