import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TokenBalance from '../token-balance'
import Identicon from '../identicon'
import UserPreferencedCurrencyDisplay from '../../app/user-preferenced-currency-display'
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common'
import { formatBalance } from '../../../helpers/utils/util'
const Web3 = require("web3");
let web3 = new Web3();

export default class Balance extends PureComponent {
  static propTypes = {
    account: PropTypes.object,
    assetImages: PropTypes.object,
    nativeCurrency: PropTypes.string,
    needsParse: PropTypes.bool,
    network: PropTypes.string,
    showFiat: PropTypes.bool,
    token: PropTypes.object,
  }

  static defaultProps = {
    needsParse: true,
    showFiat: true,
  }

  renderBalance () {
    const { account, nativeCurrency, needsParse, showFiat } = this.props
    const balanceValue = account && account.balance
    const formattedBalance = balanceValue
      ? formatBalance(balanceValue, 6, needsParse, nativeCurrency)
      : '...'

    if (formattedBalance === 'None' || formattedBalance === '...') {
      return (
        <div className="flex-column balance-display">
          <div className="token-amount">
            { formattedBalance }
          </div>
        </div>
      )
    }

    return (
      <div className="flex-column balance-display">
        <UserPreferencedCurrencyDisplay
          className="token-amount"
          value={balanceValue}
          type={PRIMARY}
          ethNumberOfDecimals={4}
        />
        <div style={{display: 'flex', 'align-items': 'center'}}>
          {
            showFiat && (
              <div style={{display: 'flex'}}>
                <div className="fiat-container">
                  <UserPreferencedCurrencyDisplay
                    value={balanceValue}
                    type={SECONDARY}
                    ethNumberOfDecimals={4}
                  />
                  <div className="balance-display__separator">
                    |
                  </div>
                </div>
              </div>
            )
          }
         
          <div  className="balance-display__secondary-balance">
            <span className="xp" title={ this.formatXP(account.xp) }>
              {this.formatXP(account.xp)}
            </span>
            <span className="xp-suffix">
              XP
            </span>
          </div>
        </div>
      </div>
    )
  }

  formatXP(xp) {
    return web3.fromWei(xp, "ether");
  }

  formatXSP(xsp) {
    return web3.fromWei(xsp, "ether");
  }

  renderTokenBalance () {
    const { token } = this.props

    return (
      <div className="flex-column balance-display">
        <div className="token-amount">
          <TokenBalance token={token} />
        </div>
      </div>
    )
  }

  render () {
    const { token, network, assetImages } = this.props
    const address = token && token.address
    const image = assetImages && address ? assetImages[token.address] : undefined

    return (
      <div className="balance-container">
        <Identicon
          diameter={50}
          address={address}
          network={network}
          image={image}
        />
        { token ? this.renderTokenBalance() : this.renderBalance() }
      </div>
    )
  }
}
