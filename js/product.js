//匯入 Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

import { url, api_path } from './config.js'
import pagination from './components/pagination.js';
import deleteComponent from './components/deleteComponent.js';
import { productModal } from './components/productModalComponent.js';

// 全域需要使用到，元件化時才會用到
// let productModal = null;
let delProductModal = null;


// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: false, // 確認是編輯或新增所使用; 新增-> isNew:true, 編輯-> isNew:false 
      page: {}
    }
  },
  components: {
    pagination,
    productModal,
    deleteComponent
  },
  methods: {
    // 驗證登入狀態
    checkLogin() {
      axios.post(`${url}/api/user/check`)
      .then(res => {
        this.getProducts();
      }).catch(err => {
        console.log(err);
      })
    },
    // 取得產品列表
    getProducts(page = 1) {
      axios.get(`${url}/api/${api_path}/admin/products/?page=${page}`)
        .then((res)=> {
          this.products = res.data.products;
          // console.log(res.data);
          this.page = res.data.pagination; //將分頁資訊(pagination)存起來
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    // 刪除產品
    deleteProduct() {
      axios.delete(`${url}/api/${api_path}/admin/product/${this.tempProduct.id}`)
      .then((res)=> {
        alert(res.data.message);
        delProductModal.hide(); //關閉 Modal
        this.getProducts();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    //打開 Modal
    openModal(operateType, product) {
      if(operateType === 'create'){ //建立產品
        this.$refs.productModal.showModal();
        this.isNew = true;
        // 帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        }
      } else if(operateType === 'modify') { //編輯產品
        this.isNew = false;
        // 會帶入當前要編輯的資料
        this.tempProduct = { ...product }; //使用展開語法 ... , 則不會直接異動到原先資料
        this.$refs.productModal.showModal();
      } else if(operateType === 'delete') { // 刪除產品
        this.tempProduct = { ...product }; // 主要作為取得 id 使用
        delProductModal.show();
      }
    }
  },
  mounted() {
    // 將 cookie 取出來 (MDN 文件提供的方式)
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('hexToken='))
    ?.split('=')[1];
    // 透過 axios 將token(即取出的cookie值) 發送到headers
    axios.defaults.headers.common['Authorization'] = cookieValue;
    this.checkLogin();

    // Bootstrap 方法取得 modal
    delProductModal = new bootstrap.Modal('#delProductModal');
  }
})

// 另一種寫法:
// app.component('product-modal', {
//   props: ['tempProduct', 'updateProduct'],
//   template: '#product-modal-template',
// })

app.mount('#app');