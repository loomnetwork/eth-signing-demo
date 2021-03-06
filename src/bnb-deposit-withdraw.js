import BNBCoin from './bnb/BNBCoin'
import { EventBus } from './EventBus/EventBus.js'
const Web3 = require('web3')

Vue.use(Toasted)

var sample = new Vue({
  el: '#bnb-deposit-withdraw',
  data: {
    bnbBalance: 'Wait a bit until it gets initialized...',
    bnbCoin: null,
    binanceAddress: null,
    loomAddress: null,
    howToDeposit: null,
    amountToWithdraw: null
  },
  watch: {
    loomAddress: function () {
      let tempAddress = this.loomAddress.slice(2, this.loomAddress.length)
      tempAddress = 'loom' + tempAddress
      this.howToDeposit = 'Go to testnet.binance.org. Next, transfer some BNB to the Extdev hot wallet address: tbnb1gc7azhlup5a34t8us84x6d0fluw57deuf47q9w. \
      Put your extdev address (' + tempAddress + ') in the memo field. \
      You extdev balance will get updated in a bit.'
    }
  },
  methods: {
    async depositWithdrawBNBExample () {
      EventBus.$on('updateBNBBalance', this.updateBalance)
      EventBus.$on('loomAddress', this.updateLoomAddress)
      EventBus.$on('updateStatus', this.updateStatus)
      this.bnbCoin = new BNBCoin()
      this.bnbCoin.load(this.web3js)
    },
    updateBalance (data) {
      this.bnbBalance = 'BNB Balance: ' + data.newBalance
    },
    updateLoomAddress (data) {
      this.loomAddress = data.loomAddress
    },
    updateStatus (data) {
      const currentStatus = data.currentStatus
      this.makeToast(currentStatus)
    },
    async withdrawBNB () {
      if ((this.binanceAddress === null) || (this.binanceAddress.length === 0)) {
        console.log('Binance Address should not be empty.')
        return
      }
      if (this.amountToWithdraw === null) {
        console.log('Amount should not be empty.')
        return
      }
      const amount = this.amountToWithdraw.replace(',', '.')
      if (isNaN(amount)) {
        console.log('Amount to withdraw should be a valid number.')
        return
      }
      await this.bnbCoin.withdrawBNB(this.binanceAddress, amount)
    },
    async loadWeb3 () {
      if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        this.web3js = new Web3(window.web3.currentProvider)
        await ethereum.enable()
      } else {
        alert('Metamask is not Enabled')
      }
    },
    async makeToast (data) {
      Vue.toasted.show(data, {
        duration: 4000,
        type: 'info',
        action: {
          text: 'Dismiss',
          onClick: (e, toast) => {
            toast.goAway(0)
          }
        }
      })
    }
  },
  async mounted () {
    await this.loadWeb3()
    await this.depositWithdrawBNBExample()
  }
})
