<template>
  <div class="review_write" v-if="orderOptionProduct">
    <div class="rvw_product">
      <div class="ctl_item_info">
        <div class="ctl_photo">
          <router-link :to="`/product/${orderOptionProduct.productNo}`"><img :src="orderOptionProduct.imageUrl?orderOptionProduct.imageUrl:''" alt=""></router-link>
        </div>
        <div class="ctl_txt_box">
          <p class="ctl_name">
            <strong>{{orderOptionProduct.brandName}}</strong>
            <router-link :to="`/product/${orderOptionProduct.productNo}`">{{orderOptionProduct.productName}}</router-link>
          </p>
          <div class="ctl_option">
            <span v-for="showOption in orderOptionProduct.showOptions" :key="showOption.index">{{showOption}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- // rvw_product -->
    <dl class="rvw_star">
      <dt>별점으로 상품을 추천해주세요.</dt>
      <dd>
        <div class="star_select" v-bind:class="startShowFlg?'is_open':''">
          <a @click.prevent="clickSelectStar" ref="rateFocus">
            <div v-if="rate === 5">
              <div class="star">
                <span class="star_on star5"></span>
              </div>
              <div class="score">
                <strong>5점</strong>
              </div>
            </div>
            <div v-if="rate === 4">
              <div class="star">
                <span class="star_on star4"></span>
              </div>
              <div class="score">
                <strong>4점</strong>
              </div>
            </div>
            <div v-if="rate === 3">
              <div class="star">
                <span class="star_on star3"></span>
              </div>
              <div class="score">
                <strong>3점</strong>
              </div>
            </div>
            <div v-if="rate === 2">
              <div class="star">
                <span class="star_on star2"></span>
              </div>
              <div class="score">
                <strong>2점</strong>
              </div>
            </div>
            <div v-if="rate === 1">
              <div class="star">
                <span class="star_on star1"></span>
              </div>
              <div class="score">
                <strong>1점</strong>
              </div>
            </div>
            <div v-if="rateInitVal === 5 && rate === ''">
              <div class="star">
                <span class="star_on star5"></span>
              </div>
              <div class="score">
                <strong>5점</strong>
              </div>
            </div>
            <div v-if="rateInitVal === 4 && rate === ''">
              <div class="star">
                <span class="star_on star4"></span>
              </div>
              <div class="score">
                <strong>4점</strong>
              </div>
            </div>
            <div v-if="rateInitVal === 3 && rate === ''">
              <div class="star">
                <span class="star_on star3"></span>
              </div>
              <div class="score">
                <strong>3점</strong>
              </div>
            </div>
            <div v-if="rateInitVal === 2 && rate === ''">
              <div class="star">
                <span class="star_on star2"></span>
              </div>
              <div class="score">
                <strong>2점</strong>
              </div>
            </div>
            <div v-if="rateInitVal === 1 && rate === ''">
              <div class="star">
                <span class="star_on star1"></span>
              </div>
              <div class="score">
                <strong>1점</strong>
              </div>
            </div>
          </a>
          <ul>
            <li>
              <a @click.prevent="startSelected(5)">
                <div class="star">
                  <span class="star_on star5"></span>
                </div>
                <div class="score">
                  <strong>5점</strong>
                </div>
              </a>
            </li>
            <li>
              <a @click.prevent="startSelected(4)">
                <div class="star">
                  <span class="star_on star4"></span>
                </div>
                <div class="score">
                  <strong>4점</strong>
                </div>
              </a>
            </li>
            <li>
              <a @click.prevent="startSelected(3)">
                <div class="star">
                  <span class="star_on star3"></span>
                </div>
                <div class="score">
                  <strong>3점</strong>
                </div>
              </a>
            </li>
            <li>
              <a @click.prevent="startSelected(2)">
                <div class="star">
                  <span class="star_on star2"></span>
                </div>
                <div class="score">
                  <strong>2점</strong>
                </div>
              </a>
            </li>
            <li>
              <a @click.prevent="startSelected(1)">
                <div class="star">
                  <span class="star_on star1"></span>
                </div>
                <div class="score">
                  <strong>1점</strong>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </dd>
    </dl>
    <!-- // rvw_star -->
    <dl class="rvw_img" v-if="webFlg || (this.dataFileUrlsInitVal && this.dataFileUrlsInitVal.length > 0)">
      <dt>사진으로 상품을 설명해주세요.</dt>
      <dd>
        <div class="file">
          <template v-if="this.dataFileUrlsInitVal">
            <div class="img" v-for="(image, key) in dataFileUrlsInitVal " :key="key">
              <img :src="image" alt="" @load="imageLoaded">
              <a class="btn_del" v-on:click.prevent="deldataFileUrl(key)" v-if="webFlg">이미지 삭제</a>
            </div>
          </template>
          <template v-if="images.length > 0">
            <div class="img" v-for="(image, key) in images " :key="key">
              <img :src="image.filedata" alt="" @load="imageLoaded">
              <a class="btn_del" v-on:click.prevent="delImage(key)" v-if="webFlg">이미지 삭제</a>
            </div>
          </template>
          <button class="file_btn" v-on:click="addPic" v-if="(this.images.length + (this.dataFileUrlsInitVal?this.dataFileUrlsInitVal.length:0)) < 10 && webFlg">이미지첨부</button>
          <input type="file" @change="onFileChange" ref="flup" multiple="multiple" style="display: none;" accept="image/*" />
        </div>
        <p class="notice" v-if="webFlg">사진은 최대 10장 까지 등록가능합니다.</p>
      </dd>
    </dl>
    <!-- // rvw_photo -->
    <dl class="rvw_txt">
      <dt>
        <label for="">상품평 본문을 작성해주세요.</label>
      </dt>
      <dd>
        <div class="inp_txt inp_placeholder">
          <textarea name="" id="" v-model="contentInitVal" cols="30" rows="10" class="inp" ref="contentFocus" @blur="contentblurEdit" @focus="contentfocusEdit"></textarea>
          <div class="placeholder" v-if="contentEditFlg">
            <p>
              광고, 저작권 침해, 욕설, 비방, 음란 등 상품과<br> 관계없는 글은 임의 삭제가 됨을 알려드립니다.
            </p>
            <p>
              전화번호, 메일 주소 등 고객님의 소중한 개인정보를<br> 남기지 않도록 주의하세요.
            </p>
          </div>
        </div>
      </dd>
    </dl>
    <!-- // rvw_txt -->
    <div class="rvw_notice">
      <p>
        상품평 작성을 완료 하시면 구매확정 처리되어 결제금액이 판매자에게 송금 됩니다.
      </p>
    </div>
    <!-- // rvw_notice -->
    <div class="rvw_btn">
      <a @click.prevent="updateReview" class="btn_style1">상품평 수정완료</a>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import ssq from 'jquery'
export default {
  data () {
    return {
      running: false,
      rate: '',
      content: '',
      images: [],
      dataFileUrls: [],
      startShowFlg: false,
      contentEditFlg: false,
      initFlg: false
    }
  },
  metaInfo: {
    title: '상품평 작성'
  },
  methods: {
    imageLoaded (event) {
      const imageDiv = ssq('.file_btn').eq(0).outerWidth()
      let maxWidth = document.body.clientWidth - 84
      const img = event.target
      if (img.naturalWidth >= 500 || img.naturalHeight >= 500) {
        let tempSize = 0
        if (img.naturalWidth > img.naturalHeight) {
          tempSize = img.naturalWidth
        } else {
          tempSize = img.naturalHeight
        }
        img.width = img.naturalWidth * imageDiv / maxWidth * (maxWidth / tempSize)
      } else {
        img.height = img.naturalHeight * imageDiv / maxWidth
      }
    },
    clickSelectStar () {
      this.startShowFlg = !this.startShowFlg
    },
    startSelected (selstart) {
      this.startShowFlg = false
      this.rate = selstart
    },
    contentblurEdit () {
      if (this.contentInitVal && this.contentInitVal.length > 0) {
        this.contentEditFlg = false
      } else {
        this.contentEditFlg = true
      }
    },
    contentfocusEdit () {
      this.contentEditFlg = false
    },
    updateReview () {
      const paramsReview = {
        rate: this.rate ? this.rate : this.rateInitVal,
        content: this.content ? this.content : this.contentInitVal,
        images: this.images,
        dataFileUrls: this.dataFileUrls.length > 0 ? this.dataFileUrls : this.dataFileUrlsInitVal,
        urls: [],
        reviewNo: this.$store.state.route.params.reviewNo,
        productNo: this.$store.state.route.params.productNo
      }
      if (paramsReview.rate === '') {
        alert('평점을 선택 해 주세요.')
        this.$refs.rateFocus.focus()
        return
      }
      if (paramsReview.content === '') {
        alert('상품평 본문을 입력 해 주세요.')
        this.$refs.contentFocus.focus()
        return
      }
      if (this.running) {
        return
      } else {
        this.running = true
      }
      const dispatch = this.$store.dispatch
      Promise.all(paramsReview.images.map((image) => {
        const data = new FormData()
        data.append('file', image.file)
        return dispatch('common/uploadImages', data)
      })).then(ret => {
        const uploadreturls = ret.map(res => res.data.imageUrl)
        if (paramsReview.dataFileUrls.length > 0) {
          paramsReview.urls.push(...paramsReview.dataFileUrls)
        }
        paramsReview.urls.push(...uploadreturls)
        dispatch('profilereview/putProductReviews', paramsReview).then(() => {
          alert('상품평 수정이 완료되었습니다.')
          const fromUrl = this.$store.state.route.query.fromUrl
          window.location.href = fromUrl
          this.running = false
        }).catch((e) => {
          this.running = false
        })
      })
    },
    addPic (e) {
      e.preventDefault()
      this.$refs.flup.click()
      return false
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      if ((files.length + this.images.length + (this.dataFileUrlsInitVal ? this.dataFileUrlsInitVal.length : 0)) > 10) {
        alert('상품평 첨부파일은 10개까지 등록 가능합니다.')
        return
      }
      this.createImage(files)
      e.target.value = ''
    },
    createImage (files) {
      if (typeof FileReader === 'undefined') {
        return false
      }
      var vm = this
      var leng = files.length
      for (var i = 0; i < leng; i++) {
        const fileitem = {}
        fileitem.file = files[i]
        var reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onload = function (e) {
          fileitem.filedata = e.target.result
          vm.images.push(fileitem)
        }
      }
    },
    delImage (index) {
      let ret = confirm('사진을 삭제하시겠습니까?')
      if (ret) {
        this.images.splice(index, 1)
      }
    },
    deldataFileUrl (index) {
      let ret = confirm('사진을 삭제하시겠습니까?')
      if (ret) {
        this.dataFileUrlsInitVal.splice(index, 1)
      }
    }
  },
  computed: {
    rateInitVal: {
      get () {
        if (this.productReviewDetail) {
          return this.productReviewDetail.rate
        }
      },
      set (val) {
        this.rate = val
      }
    },
    contentInitVal: {
      get () {
        if (this.productReviewDetail && !this.initFlg) {
          return this.productReviewDetail.content
        } else {
          return this.content
        }
      },
      set (val) {
        this.content = val
        this.initFlg = true
      }
    },
    dataFileUrlsInitVal: {
      get () {
        if (this.productReviewDetail) {
          return this.productReviewDetail.fileUrls
        }
      },
      set (val) {
        this.dataFileUrls = val
      }
    },
    webFlg: {
      get () {
        return this.$store.state.osType() === 'WEB'
      }
    },
    ...mapGetters('myorder', ['orderOptionProduct']),
    ...mapState('profilereview', ['productReviewDetail'])
  }
}
</script>

<style>

</style>


