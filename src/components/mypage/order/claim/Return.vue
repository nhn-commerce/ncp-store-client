<template>
  <div id="contents" class="mypage_wrap" v-if="claimOrderOption">
    <form action="">
      <fieldset>
        <legend class="acc-hidden">반품 신청 폼</legend>
        <section class="order_section">
          <div class="os_top">
            <h3 class="title_style1 title">반품신청 상품정보</h3>
          </div>
          <div class="os_con myorder_claim">
            <div class="claim_item">
              <!-- ctl_item_info -->
              <div class="ctl_item_info">
                <div class="ctl_photo">
                  <router-link :to="`/product/${claimOrderOption.originalOption.productNo}`"><img :src="claimOrderOption.originalOption.imageUrl?claimOrderOption.originalOption.imageUrl:''" alt=""></router-link>
                </div>
                <div class="ctl_txt_box">
                  <p class="ctl_name">
                    <strong>{{claimOrderOption.originalOption.brandName}}</strong>
                    <router-link :to="`/product/${claimOrderOption.originalOption.productNo}`">{{claimOrderOption.originalOption.productName}}</router-link>
                  </p>
                  <div class="ctl_option">
                    <span v-for="showOption in claimOrderOption.originalOption.showOptions" :key="showOption.index">{{showOption}}</span>
                  </div>
                  <div class="ctl_price">
                    <div class="ctl_p_top">
                      <p class="total">
                        <strong>{{miliFormat(claimOrderOption.originalOption.price.buyAmt)}}</strong>원</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- // ctl_item_info -->
            </div>
            <div class="order_info">
              <dl class="oi_w">
                <dt>
                  <label for="selectProductCnt">반품신청 수량</label>
                </dt>
                <dd>
                  <select id="selectProductCnt" v-model="returnInfo[0].productCnt" @change.prevent="updateProductCnt" ref="productCntFocus">
                    <option value=0>선택</option>
                    <option v-for="selectProductCnt in claimOrderOption.originalOption.orderCnt" :value="selectProductCnt" :key="selectProductCnt">
                      {{selectProductCnt}}
                    </option>
                  </select>
                </dd>
              </dl>
            </div>
            <template v-for="(claimInfo,index) in viewableClaimOptions" v-if="viewableClaimOptions && viewableClaimOptions.length > 0">
              <div class="claim_item">
                <!-- ctl_item_info -->
                <div class="ctl_item_info">
                  <div class="ctl_photo">
                    <router-link :to="`/product/${claimInfo.productNo}`"><img :src="claimInfo.imageUrl?claimInfo.imageUrl:''" alt=""></router-link>
                  </div>
                  <div class="ctl_txt_box">
                    <p class="ctl_name">
                      <strong>{{claimInfo.brandName}}</strong>
                      <router-link :to="`/product/${claimInfo.productNo}`">{{claimInfo.productName}}</router-link>
                    </p>
                    <div class="ctl_option">
                      <span v-for="showOption in claimInfo.showOptions" :key="showOption.index">{{showOption}}</span>
                    </div>
                    <div class="ctl_price">
                      <div class="ctl_p_top">
                        <p class="total">
                          <strong>{{miliFormat(claimInfo.price.buyAmt)}}</strong>원</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- // ctl_item_info -->
              </div>
              <div class="order_info">
                <dl class="oi_w">
                  <dt>
                    <label for="selectProductCnt">반품신청 수량</label>
                  </dt>
                  <dd>
                    <select id="selectProductCnt" v-model="returnInfo[index + 1].productCnt" @change.prevent="updateProductCnt()">
                      <option value=0>선택</option>
                      <option v-for="selectProductCnt in claimInfo.orderCnt" :value="selectProductCnt" :key="selectProductCnt">
                        {{selectProductCnt}}
                      </option>
                    </select>
                  </dd>
                </dl>
              </div>
            </template>
            <div class="order_info">
              <dl class="oi_w">
                <dt>
                  <label for="selectClaimReasonTypeId">반품사유 구분</label>
                  <div class="order_notice_txt">
                    <span>{{responsibleObjectTypelabel}}</span>
                  </div>
                </dt>
                <dd>
                  <select v-model="claimReasonType" id="selectClaimReasonTypeId" ref="claimReasonTypeFocus" @change.prevent="claimReasonTypeSelect">
                    <option value="">선택하세요</option>
                    <option v-for="selectClaimReasonType in claimOrderOption.claimReasonTypes" :value="selectClaimReasonType.claimReasonType" :key="selectClaimReasonType.claimReasonType">
                      {{selectClaimReasonType.label}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="oi_w">
                <dt>
                  <label for="claimReasonDetail">반품 상세 사유</label>
                </dt>
                <dd>
                  <textarea name="" id="claimReasonDetail" v-model="claimReasonDetail" cols="30" rows="10" placeholder="상세한 사유를 입력 해 주세요."></textarea>
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <section class="order_section" v-if="multipleClaimEstimate">
          <div class="os_top">
            <h3 class="title_style1 title">환불예정 정보</h3>
          </div>
          <div class="os_con">
            <div class="buy_discount">
              <dl>
                <dt>환불 상품금액</dt>
                <dd>
                  <strong>{{miliFormat(multipleClaimEstimate.productAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 배송비</dt>
                <dd>
                  <strong>{{miliFormat(multipleClaimEstimate.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 차감금액</dt>
                <dd>
                  <strong>(-) {{miliFormat(multipleClaimEstimate.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
            </div>
            <dl class="buy_total">
              <template v-if="claimOrderOption.payType !== 'VIRTUAL_ACCOUNT' && claimOrderOption.payType !== 'REALTIME_ACCOUNT_TRANSFER'">
                <dt>환불금액
                  <span>(신용카드)</span>
                </dt>
              </template>
              <template v-if="claimOrderOption.payType === 'VIRTUAL_ACCOUNT'">
                <dt>환불금액
                  <span>(현금환불)</span>
                </dt>
              </template>
              <template v-if="claimOrderOption.payType === 'REALTIME_ACCOUNT_TRANSFER'">
                <dt>환불금액
                  <span>(계좌이체)</span>
                </dt>
              </template>
              <dd>
                <strong>{{miliFormat(multipleClaimEstimate.refundPayAmt)}}</strong> 원
              </dd>
            </dl>
            <div class="term_discount" v-if="claimOrderOption.payType === 'VIRTUAL_ACCOUNT'">
              <dl>
                <dt>은행</dt>
                <dd>
                  <select v-model="refundBankCode" id="refundBankCode" ref="refundBankFocus">
                    <option value="">선택하세요</option>
                    <option v-for="bank in claimOrderOption.availableBanks" :value="bank.bank">{{bank.label}}</option>
                  </select>
                </dd>
              </dl>
              <dl>
                <dt>계좌번호</dt>
                <dd>
                  <input type="text" v-model="refundAccount" @input="handleInput" ref="refundAccountFocus">
                </dd>
              </dl>
              <dl>
                <dt>예금주</dt>
                <dd>
                  <input type="text" v-model="refundName" ref="refundNameFocus">
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <section class="order_section" v-if="claimOrderOption.showReturnAddress && addressupdateFlg">
          <div class="os_top">
            <h3 class="title_style1 title">반품 수거지정보</h3>
            <a @click.prevent="addressUpdate" class="btn_modify btn_style4">수거지정보 변경</a>
          </div>
          <div class="os_con myorder_addr">
            <div class="basic_info_table">
              <dl>
                <dt>받는사람</dt>
                <dd>{{claimOrderOption.showReturnAddress.receiverName}}</dd>
              </dl>
              <dl>
                <dt>수거지 주소</dt>
                <dd>
                  {{claimOrderOption.showReturnAddress.receiverZipCd}}<br> {{claimOrderOption.showReturnAddress.receiverAddress}}<br> {{claimOrderOption.showReturnAddress.receiverDetailAddress}}
                </dd>
              </dl>
              <dl>
                <dt>휴대전화</dt>
                <dd>{{claimOrderOption.showReturnAddress.contact1_1}}
                  <i class="char">-</i>{{claimOrderOption.showReturnAddress.contact1_2}}
                  <i class="char">-</i>{{claimOrderOption.showReturnAddress.contact1_3}}</dd>
              </dl>
              <dl>
                <dt>연락처</dt>
                <dd>{{claimOrderOption.showReturnAddress.contact2_1}}
                  <i class="char">-</i>{{claimOrderOption.showReturnAddress.contact2_2}}
                  <i class="char">-</i>{{claimOrderOption.showReturnAddress.contact2_3}}</dd>
              </dl>
            </div>
          </div>
        </section>
        <section class="order_section" v-if="!addressupdateFlg">
          <div class="os_top">
            <h3 class="title_style1 title">반품 수거지정보</h3>
            <div class="btn_done">
              <a @click.prevent="addressUpdateCancel" class="btn_style4">변경취소</a>
              <a @click.prevent="addressUpdateSave" class="btn_style5">변경완료</a>
            </div>
          </div>
          <div class="os_con order_modify">
            <div class="order_info">
              <dl class="">
                <dt>
                  <label for="receiverName">
                    <span class="important">받는사람</span>
                  </label>
                </dt>
                <dd>
                  <input type="text" id="receiverName" v-model="addressInfo.receiverName" ref="receiverName">
                </dd>
              </dl>
              <dl class="">
                <dt>
                  <label for="receiverDetailAddress">
                    <span class="important">주소</span>
                  </label>
                </dt>
                <dd>
                  <div class="inp_addr">
                    <input type="text" v-model="addressInfo.receiverZipCd" maxlength="7" disabled>
                    <a @click.prevent="searchAddress" class="btn_style3 btn_addr" id="btnAddrPop">주소찾기</a>
                  </div>
                  <input type="text" v-model="addressInfo.receiverAddress" disabled>
                  <input type="text" id="receiverDetailAddress" v-model="addressInfo.receiverDetailAddress" ref="detialAddress" placeholder="상세주소를 입력하세요">
                </dd>
              </dl>
              <dl class="">
                <dt>
                  <label for="contact1">
                    <span class="important">휴대전화</span>
                  </label>
                </dt>
                <dd>
                  <div class="inp_tel">
                    <input type="tel" id="contact1" v-model="addressInfo.contact1_1" maxlength="3" ref="receiverContact1_one" @change="telNoInput">
                    <i class="char">-</i>
                    <input type="tel" v-model="addressInfo.contact1_2" maxlength="4" ref="receiverContact1_two" @change="telNoInput">
                    <i class="char">-</i>
                    <input type="tel" v-model="addressInfo.contact1_3" maxlength="4" ref="receiverContact1_three" @change="telNoInput">
                  </div>
                </dd>
              </dl>
              <dl>
                <dt>
                  <label for="contact2">연락처</label>
                </dt>
                <dd>
                  <div class="inp_tel">
                    <input type="tel" id="contact2" v-model="addressInfo.contact2_1" maxlength="3" ref="receiverContact2_one" @change="telNoInput">
                    <i class="char">-</i>
                    <input type="tel" v-model="addressInfo.contact2_2" maxlength="4" ref="receiverContact2_two" @change="telNoInput">
                    <i class="char">-</i>
                    <input type="tel" v-model="addressInfo.contact2_3" maxlength="4" ref="receiverContact2_three" @change="telNoInput">
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <Addresses v-show="openSearch" @closePop="addressPopClose" @enterAndClose="selectAddressPopClose"></Addresses>
        </section>
        <div class="claim_btn">
          <a @click.prevent="returnOrderOption" class="btn_style1">반품신청완료</a>
        </div>
        <dl class="claim_notice">
          <dt>유의사항</dt>
          <dd>
            반품사유구분에 따라 반품배송비의 부담 주체가 구매자 또는 <br> 판매자로 구분됩니다. 사유가 불명확한 경우 반드시 고객센터<br> ({{ servicePhoneNo }}) 또는 상품문의를 통해 협의 후 반품신청을 해주세요.
          </dd>
          <dd>
            올바르지 않은 사유를 선택한 경우 판매자에 의해 반품이 거부될 수<br> 있습니다.
          </dd>
          <dd>
            쿠폰을 사용한 경우 반품한 금액에 따라 쿠폰적용이 취소될 수 <br> 있습니다. 이때, 쿠폰은 유효기간 내에서 복원됩니다.
          </dd>
          <dd>
            반품신청 시 판매자의 승인 후 환불됩니다. 단, 카드사의 상황에 따라 <br> 환불기간이 다소 길어질 수 있습니다.
          </dd>
        </dl>
      </fieldset>
    </form>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import Addresses from '@/components/common/Addresses'
import Validater from '@/utils/validateUtils'

export default {
  data () {
    return {
      running: false,
      claimReasonType: '',
      claimReasonDetail: '',
      productCnt: 0,
      refundBankCode: '',
      refundAccount: '',
      refundName: '',
      addressupdateFlg: true,
      openSearch: false,
      addressInfo: {
        receiverJibunAddress: '',
        receiverName: '',
        receiverZipCd: '',
        receiverAddress: '',
        receiverDetailAddress: '',
        receiverContact1: '',
        receiverContact2: '',
        contact1_1: '',
        contact1_2: '',
        contact1_3: '',
        contact2_1: '',
        contact2_2: '',
        contact2_3: ''
      }
    }
  },
  metaInfo: {
    title: '반품신청'
  },
  methods: {
    telNoInput (e) {
      e.target.value = e.target.value.replace(/[\D]/g, '')
    },
    handleInput (e) {
      this.refundAccount = e.target.value.replace(/[^\w]/g, '')
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    updateProductCnt () {
      if (this.claimReasonType !== '') {
        const claimRequest = {
          claimType: 'RETURN',
          claimReasonType: this.claimReasonType,
          claimedProductOptions: this.claimableReturnInfo(),
          returnWayType: 'SELLER_COLLECT'
        }
        this.$store.dispatch('myorder/multipleClaimEstimate', claimRequest)
      }
    },
    claimReasonTypeSelect () {
      const isEmptyReturnInfoCnt = this.returnInfo.every(info => Number(info.productCnt) === 0)
      if (!isEmptyReturnInfoCnt) {
        const claimRequest = {
          claimType: 'RETURN',
          claimReasonType: this.claimReasonType,
          claimedProductOptions: this.claimableReturnInfo(),
          returnWayType: 'SELLER_COLLECT'
        }
        this.$store.dispatch('myorder/multipleClaimEstimate', claimRequest)
      }
    },
    addressUpdate () {
      this.addressupdateFlg = false
      this.addressInfo.receiverName = this.claimOrderOption.showReturnAddress.receiverName
      this.addressInfo.receiverZipCd = this.claimOrderOption.showReturnAddress.receiverZipCd
      this.addressInfo.receiverAddress = this.claimOrderOption.showReturnAddress.receiverAddress
      this.addressInfo.receiverDetailAddress = this.claimOrderOption.showReturnAddress.receiverDetailAddress
      this.addressInfo.receiverJibunAddress = this.claimOrderOption.showReturnAddress.receiverJibunAddress
      this.addressInfo.contact1_1 = this.claimOrderOption.showReturnAddress.contact1_1
      this.addressInfo.contact1_2 = this.claimOrderOption.showReturnAddress.contact1_2
      this.addressInfo.contact1_3 = this.claimOrderOption.showReturnAddress.contact1_2
      this.addressInfo.contact2_1 = this.claimOrderOption.showReturnAddress.contact2_1
      this.addressInfo.contact2_2 = this.claimOrderOption.showReturnAddress.contact2_2
      this.addressInfo.contact2_3 = this.claimOrderOption.showReturnAddress.contact2_3
    },
    searchAddress () {
      this.openSearch = true
    },
    addressPopClose () {
      this.openSearch = false
    },
    selectAddressPopClose (type, zipCode, address, jibunAddress, detialAddress) {
      this.openSearch = false
      this.addressInfo.receiverZipCd = zipCode
      if (type === 'address') {
        this.addressInfo.receiverAddress = address
      } else {
        this.addressInfo.receiverAddress = jibunAddress
      }
      this.addressInfo.jibunAddress = jibunAddress
      this.addressInfo.receiverDetailAddress = detialAddress
    },
    returnOrderOption () {
      if (this.running) {
        return
      } else {
        this.running = true
      }

      const isEmptyReturnInfoCnt = this.returnInfo.every(info => Number(info.productCnt) === 0)
      if (isEmptyReturnInfoCnt) {
        this.running = false
        this.$refs.productCntFocus.focus()
        return alert('반품하실 상품의 수량을 확인해주세요.')
      }

      if (this.claimReasonType === '') {
        alert('반품사유 구분을 선택해 주세요.')
        this.$refs.claimReasonTypeFocus.focus()
        this.running = false
        return
      }
      if (!this.addressupdateFlg) {
        alert('반품 수거지정보 변경을 완료 해 주세요')
        this.running = false
        return
      }

      const claimRequest = {
        claimType: 'RETURN',
        claimReasonType: this.claimReasonType,
        claimReasonDetail: this.claimReasonDetail,
        saveBankAccountInfo: 'false',
        claimedProductOptions: this.claimableReturnInfo(),
        returnWayType: 'SELLER_COLLECT'
      }

      if (this.claimOrderOption.payType === 'VIRTUAL_ACCOUNT') {
        claimRequest.bankAccountInfo = {
          bankAccount: this.refundAccount.toString(),
          bank: this.refundBankCode,
          bankDepositorName: this.refundName,
          bankName: $('#refundBankCode option:checked').text()
        }
        if (claimRequest.bankAccountInfo.bank === '') {
          alert('환불은행을 선택 해 주세요.')
          this.$refs.refundBankFocus.focus()
          return
        }
        if (claimRequest.bankAccountInfo.bankAccount === '') {
          alert('계좌번호를 입력 해 주세요.')
          this.$refs.refundAccountFocus.focus()
          return
        }
        if (claimRequest.bankAccountInfo.bankDepositorName === '') {
          alert('예금주명을 입력 해 주세요.')
          this.$refs.refundNameFocus.focus()
          return
        }
      }

      claimRequest.returnAddress = this.claimOrderOption.showReturnAddress
      this.$store.dispatch('myorder/multipleClaimReturn', claimRequest).then(() => {
        alert('반품신청이 완료되었습니다. 환불관련 정보는 마이페이지의 취소반품 내역에서 확인 가능합니다.')
        this.running = false
        let fromUrl = this.$store.state.route.query.fromUrl
        if (fromUrl.indexOf('myclaim=done') === -1) {
          if (fromUrl.indexOf('?') === -1) {
            fromUrl += '?myclaim=done'
          } else {
            fromUrl += '&myclaim=done'
          }
        }
        window.location.href = fromUrl
      }).catch((e) => {
        this.running = false
      })
    },
    addressUpdateCancel () {
      let ret = confirm('수거지 정보 변경을 취소하시겠습니까?  수정 한 내용은 저장되지 않습니다.')
      if (ret) {
        this.addressupdateFlg = true
      }
    },
    addressUpdateSave () {
      const validateRole = [
        {
          inputValue: this.addressInfo.receiverName,
          message: '받는사람 입력해주세요.',
          pattern: /\S+/,
          input: this.$refs.receiverName
        },
        {
          inputValue: this.addressInfo.receiverZipCd,
          message: '주소를 입력하세요.',
          pattern: /\S+/,
          input: this.$refs.detialAddress
        },
        {
          inputValue: this.addressInfo.receiverAddress,
          message: '주소를 입력하세요.',
          pattern: /\S+/,
          input: this.$refs.detialAddress
        },
        {
          inputValue: this.addressInfo.receiverDetailAddress,
          message: '상세주소를 입력하세요.',
          pattern: /\S+/,
          input: this.$refs.detialAddress
        },
        {
          inputValue: this.addressInfo.contact1_1,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3}$/,
          input: this.$refs.receiverContact1_one
        },
        {
          inputValue: this.addressInfo.contact1_2,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3,4}$/,
          input: this.$refs.receiverContact1_two
        },
        {
          inputValue: this.addressInfo.contact1_3,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{4}$/,
          input: this.$refs.receiverContact1_three
        }
      ]
      if (this.addressInfo.contact2_1 !== '' ||
        this.addressInfo.contact2_2 !== '' ||
        this.addressInfo.contact2_3 !== ''
      ) {
        const telno2 = [
          {
            inputValue: this.addressInfo.contact2_1,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{2,3}$/,
            input: this.$refs.receiverContact2_one
          },
          {
            inputValue: this.addressInfo.contact2_2,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{3,4}$/,
            input: this.$refs.receiverContact2_two
          },
          {
            inputValue: this.addressInfo.contact2_3,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{4}$/,
            input: this.$refs.receiverContact2_three
          }]
        validateRole.push(...telno2)
      }

      const addressValidate = new Validater(validateRole)

      if (!addressValidate.validate()) {
        this.claimOrderOption.showReturnAddress.receiverContact1 = this.addressInfo.contact1_1 + '-' + this.addressInfo.contact1_2 + '-' + this.addressInfo.contact1_3
        if (this.addressInfo.contact2_1 !== '' ||
          this.addressInfo.contact2_2 !== '' ||
          this.addressInfo.contact2_3 !== ''
        ) {
          this.claimOrderOption.showReturnAddress.receiverContact2 = this.addressInfo.contact2_1 + '-' + this.addressInfo.contact2_2 + '-' + this.addressInfo.contact2_3
        }
        this.claimOrderOption.showReturnAddress.receiverName = this.addressInfo.receiverName
        this.claimOrderOption.showReturnAddress.receiverZipCd = this.addressInfo.receiverZipCd
        this.claimOrderOption.showReturnAddress.receiverAddress = this.addressInfo.receiverAddress
        this.claimOrderOption.showReturnAddress.receiverDetailAddress = this.addressInfo.receiverDetailAddress
        this.claimOrderOption.showReturnAddress.receiverJibunAddress = this.addressInfo.receiverJibunAddress
        this.claimOrderOption.showReturnAddress.contact1_1 = this.addressInfo.contact1_1
        this.claimOrderOption.showReturnAddress.contact1_2 = this.addressInfo.contact1_2
        this.claimOrderOption.showReturnAddress.contact1_3 = this.addressInfo.contact1_3
        this.claimOrderOption.showReturnAddress.contact2_1 = this.addressInfo.contact2_1
        this.claimOrderOption.showReturnAddress.contact2_2 = this.addressInfo.contact2_2
        this.claimOrderOption.showReturnAddress.contact2_3 = this.addressInfo.contact2_3
        this.addressupdateFlg = true
      }
    },
    claimableReturnInfo () {
      return this.returnInfo.filter(info => Number(info.productCnt) > 0)
    }
  },
  components: {
    Addresses
  },
  computed: {
    maxProductCnt: {
      get () {
        if (this.claimOrderOption && this.productCnt === 0) {
          return this.claimOrderOption.originalOption.orderCnt
        } else {
          return this.productCnt
        }
      },
      set (val) {
        this.productCnt = val
      }
    },
    ...mapState('myorder', ['claimOrderOption', 'multipleClaimEstimate', 'responsibleObjectTypelabel']),
    ...mapGetters('myorder', ['returnInfo', 'viewableClaimOptions']),
    ...mapGetters('common', ['servicePhoneNo'])
  }
}
</script>
