import { url, api_path } from '../config.js';

export const productModal = {
    props: ['tempProduct','isNew'], //外層元件傳資料進來
    template: '#productModal',
    data() {
        return {
            productModal: '',
        }
    },
    methods: {
      // 新增圖片
      createImagesUrl() {
        if(!this.tempProduct.imagesUrl) {
          this.tempProduct.imagesUrl = [];
        }
        this.tempProduct.imagesUrl.push('');
      },
      // 刪除圖片
      deleteImagesUrl() {
        this.tempProduct.imagesUrl.pop();
      },
      // 新增 & 編輯 產品 (新增和編輯的邏輯相同)
      updateProduct() {
        // POST : 用於新增產品
        // PUT : 用於編輯產品
        let urlPath = `${url}/api/${api_path}/admin/product`;
        // 用 this.isNew 判斷 API 要怎麼運行
        let http = 'post';
        if (!this.isNew) {
          urlPath = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
          http = 'put';
        }
        axios[http](urlPath, { data:this.tempProduct })
          .then(() => {
            // // 呼叫根元件(外層)的方法 定義一個名稱
            this.$emit('renderPage');
            this.productModal.hide(); //關閉 Modal
          }).catch((err) => {
            alert(err.data.message);
          })
      },
      showModal() {
          this.productModal.show();
      }
    },
    mounted() {
        // dom 生成後，再取得 model
        this.productModal = new bootstrap.Modal('#productModal');
    }
}