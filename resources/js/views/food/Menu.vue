<template>
  <div class="app-container">
    <div class="filter-container filter-container--menu">
      <div class="action-add-button">
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">
          {{ $t('menu.add') }}
        </el-button>
        <el-button type="primary" icon="el-icon-arrow-up" @click="handleUpload">
          {{ $t('menu.upload_concurrently') }}
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleMultipeDelete">
          {{ $t('menu.delete_multiple') }}
        </el-button>
      </div>
      <div class="filter-container__item" style="text-align: right">
        <div class="filter-item-wrapper">
          <el-input v-model="query.name" :placeholder="$t('table.keyword')" class="filter-item-search" @keyup.enter.native="handleFilter" />
          <el-select v-model="query.category_id" :placeholder="$t('table.category')" clearable class="filter-item-category" @change="handleFilter">
            <el-option v-for="ctg of menuFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('table.status')" clearable class="filter-item-status" @change="handleFilter">
            <el-option v-for="st in statusFilter" :key="st.value" :label="st.name" :value="st.value" />
          </el-select>
        </div>
        <div class="filter-item-button">
          <el-button v-waves type="secondary" @click="handleResetFilter">
            {{ $t('table.reset') }}
          </el-button>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" />
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="table-wrapper">
      <el-table :key="tableKey" v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <el-checkbox size="large" @change="handleSelectedProduct(scope.row.id)" />
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!isMobile" align="center" :label="$t('table.picture')">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picture"
              fit="fill"
            />
          </template>
        </el-table-column>
        <el-table-column v-if="pictures === true ">
          <template slot-scope="scope">
            <span> {{ scope.row.pictures }} </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="!isMobile" align="center" :label="$t('table.category')">
          <template slot-scope="scope">
            <span>{{ category[scope.row.category_id] }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="!isMobile" align="center" :label="$t('table.price')">
          <template slot-scope="scope">
            <span>{{ scope.row.price | price_format }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.stock')">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active" active-color="#13ce66" inactive-color="#ff4949" @change="doChangeStatus(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')" width="250">
          <template slot-scope="scope">
            <!-- <el-button v-permission="['manage food']" type="warning" size="small" icon="el-icon-share" @click="handleCopy(scope.row)" /> -->
            <el-button v-permission="['manage food']" type="default" size="small" icon="el-icon-data-analysis" @click="handleDetail(scope.row)" />
            <el-button v-permission="['manage food']" type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button v-permission="['manage food']" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id, scope.row.name);" />
          </template>
        </el-table-column>
      </el-table>

      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </div>

    <el-dialog :title="$t('menu.upload')" :visible.sync="dialogUploadFormVisible" :custom-class="'rounded-border'">
      <div v-loading="itemCreating" class="form-container">
        <el-button type="secondary" size="small" @click="getTemplateFile()">{{ $t('menu.download_template') }}</el-button>
        <br>
        <br>
        <br>
        <el-form ref="itemForm" :model="uploadMenu" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-upload
            class="upload-demo"
            action="/api/assets"
            :on-success="handleUploadFileSuccess"
            :on-error="handleFileError"
            :on-remove="handleFileRemove"
            :before-upload="handleFileBeforeUpload"
            :file-list="uploadFileList"
            list-type="text"
            :limit="1"
          >
            <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            <div slot="tip" class="el-upload__tip">{{ $t('table.upload.xlsx_helper') }}</div>
          </el-upload>
        </el-form>
        <br>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button id="ok" type="primary" @click="doUploadMenu()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- CREATE -->
    <el-dialog id="addMenu" :title="$t('menu.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="itemCreating" class="form-container">
        <el-form ref="itemForm" :rules="rules" :model="newItem" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="newItem.name" />
          </el-form-item>
          <el-form-item :label="$t('table.category')" prop="category_id">
            <el-select v-model="newItem.category_id" :placeholder="$t('table.category')" clearable class="filter-item">
              <el-option v-for="ctg of menuFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.short_description')" prop="short_desc">
            <el-input v-model="newItem.short_desc" type="textarea" :rows="2" :maxlength="300" show-word-limit />
          </el-form-item>
          <el-form-item :label="$t('table.description')" prop="description">
            <el-input v-model="newItem.description" type="textarea" :rows="3" :maxlength="600" show-word-limit />
          </el-form-item>
          <el-form-item :label="$t('table.picture')">
            <!--
            <el-upload
              :class="newItem.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileList"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button id="img" size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
            -->
            <el-form-item label="Wajib" />
            <el-upload
              ref="up"
              action=""
              :file-list="SingleList"
              :show-file-list="true"
              list-type="picture-card"
              :auto-upload="true"
              :limit="1"
              :on-exceed="handleExceed"
              :http-request="uploadSectionFile"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{ file }">
                <img
                  v-if="image"
                  class="el-upload-list__item-thumbnail"
                  :src="image"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove1(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
            <el-form-item label="Optional" />
            <input multiple type="file" @change="onFileChange">
            <ul v-if="imagess" id="preview">
              <li v-for="(imagee, index) in imagess" :key="index">
                <div class="uploaded_file_view">
                  <img :src="imagee">
                  <span class="file_remove" @click="removeImage(index)">X</span>
                </div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="newItem.is_active" />
          </el-form-item>
          <el-form-item :label="$t('table.price')">
            <el-input v-model="newItem.priceFormated" class="input-with-prefix" @input="createHandleInputPrice">
              <template slot="prepend">Rp</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('table.stock')">
            <el-input v-model="newItem.stock" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.long')">
            <el-input v-model="newItem.length" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.tall')">
            <el-input v-model="newItem.height" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.wide')">
            <el-input v-model="newItem.width" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.heavy')">
            <el-input v-model="newItem.weight" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createMenu()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- Update -->
    <el-dialog :title="$t('menu.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="menuUpdating" class="form-container">
        <el-form ref="updateForm" :rules="rules" :model="updateMenu" label-position="left" label-width="150px" style="max-width: 500px;">
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="updateMenu.name" />
          </el-form-item>
          <el-form-item :label="$t('table.category')" prop="category_id">
            <el-select v-model="updateMenu.category_id" placeholder="Category" clearable class="filter-item">
              <el-option v-for="ctg of menuFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.short_description')" prop="short_desc">
            <el-input v-model="updateMenu.short_desc" type="textarea" :rows="2" :maxlength="300" />
          </el-form-item>
          <el-form-item :label="$t('table.description')" prop="description">
            <el-input v-model="updateMenu.description" type="textarea" :rows="3" :maxlength="600" />
          </el-form-item>
          <el-form-item :label="$t('table.picture')" prop="email">
            <!--
            <el-upload
              :class="updateMenu.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileListUpdate"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
            -->
            <el-form-item label="Wajib" />
            <el-upload
              ref="up"
              action=""
              :file-list="fileListUpdate"
              :show-file-list="true"
              list-type="picture-card"
              :auto-upload="true"
              :limit="1"
              :on-exceed="handleExceed"
              :http-request="uploadSectionFile"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{ file }">
                <img
                  v-if="updateUrl"
                  class="el-upload-list__item-thumbnail"
                  :src="updateUrl"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove1(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
            <el-form-item label="Optional" />
            <input multiple type="file" @change="onFileChange1">
            <ul v-if="imagess" id="preview">
              <li v-for="(imagee, index) in MultipleUrlUpdate" :key="index">
                <div class="uploaded_file_view">
                  <img :src="imagee">
                  <span class="file_remove" @click="removeImage1(index)">X</span>
                </div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="updateMenu.is_active" />
          </el-form-item>
          <el-form-item :label="$t('table.price')">
            <el-input v-model="updateMenu.priceFormated" class="input-with-prefix" @input="updateHandleInputPrice">
              <template slot="prepend">Rp</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('table.stock')">
            <el-input v-model="updateMenu.stock" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.long')">
            <el-input v-model="updateMenu.length" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.tall')">
            <el-input v-model="updateMenu.height" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.wide')">
            <el-input v-model="updateMenu.width" />
          </el-form-item>
          <el-form-item :label="$t('menu.measure.heavy')">
            <el-input v-model="updateMenu.weight" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doupdateMenu()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- DETAIL -->
    <el-dialog :visible.sync="dialogDetailVisible" :title="$t('menu.detail')" :custom-class="'rounded-border dialog-menu'">
      <el-table :data="detailMenu" :show-header="false">
        <el-table-column :label="$t('table.name')" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.name !== 'Gambars'">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.count')" align="left">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.name === 'Gambar'"
              style="width: 300px; height: 300px"
              :src="scope.row.value"
              fit="contain"
              lazy
            />
            <span v-else-if="scope.row.name === 'Gambars'">
              <span v-for="(i, index) in scope.row.value" :key="index">
                <el-image
                  style="width: 300px; height: 300px"
                  :src="i"
                  fit="contain"
                  lazy
                />
              </span>
            </span>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { fetchListCategory } from '@/api/category';
import { fetchListMenu, createMenu, updateMenu, deleteMenu, getTemplateMenu, uploadMenu, deleteMenuMultiple } from '@/api/menu';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission'; // Permission directive
import { uploadImage } from '@/api/uploadImage';
import { isValidImage, isAllowedImageSize, compressImage } from '@/utils/validateImage';
import currencyFormated from '@/utils/currencyFormated';
import i18n from '@/lang';

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    price_format(value) {
      const currency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      });

      return currency.format(value);
    },
  },
  data() {
    return {
      imagess: [],
      pictures: false,
      image: '',
      SingleList: [],
      disabled: false,
      list: null,
      menuFilter: [],
      statusFilter: [{
        name: 'Aktif',
        value: 'true',
      }, {
        name: 'Tidak Aktif',
        value: 'false',
      }],
      category: [],
      total: 0,
      tableKey: 0,
      loading: true,
      downloading: false,
      itemCreating: false,
      menuUpdating: false,
      query: {
        page: 1,
        merchant_id: 0,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      },
      dummyQuery: {
        merchant_id: 0,
        page: 1,
        limit: 999999999999,
      },
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      uploadMenu: {},
      rules: {
        name: [{ required: true, message: i18n.t('error_message.name'), trigger: 'blur' }],
        short_desc: [{ required: true, message: i18n.t('error_message.short_description'), trigger: 'blur' }],
        description: [{ required: true, message: i18n.t('error_message.description'), trigger: 'blur' }],
        category_id: [{ required: true, message: i18n.t('error_message.category'), trigger: 'blur' }],
      },
      newItem: {
        priceFormated: 0,
      },
      updateMenu: {},
      detailMenu: [],
      fileList: [],
      uploadFileList: [],
      fileListUpdate: [],
      MultipleUrlUpdate: [],
      updateUrl: '',
      value1: false,
      uploadFileUrl: '',
      selectedProduct: [],
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
  },
  created() {
    this.dummyQuery.store_id = parseInt(atob(localStorage.getItem('store_id')));
    this.dummyQuery.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
    fetchListCategory(this.dummyQuery).then(response => {
      if (response.data) {
        for (const tmp of response.data) {
          this.category[tmp.id] = tmp.name;
          this.menuFilter.push({
            name: tmp.name,
            value: tmp.id,
          });
        }
        this.getList();
      }
    });
    this.resetnewItem();
  },
  methods: {
    async handleCopy(row) {
      const textCopy = `Ayo cek ${row.name} dengan harga ${this.$options.filters.price_format(row.price)} di ${row.store_name} melalui BerandaToko di link berikut ya ${process.env.MIX_MICROSITE_URL + '/a/' + row.reference_id}

Selamat berbelanja!`;
      try {
        await navigator.clipboard.writeText(textCopy);
        this.$message({
          message: i18n.t('menu.toaster.copy.success'),
          type: 'success',
          duration: 5 * 1000,
        });
      } catch ($e) {
        this.$message({
          message: i18n.t('menu.toaster.copy.failed'),
          type: 'error',
          duration: 5 * 1000,
        });
      }
    },
    createHandleInputPrice(value) {
      this.newItem.priceFormated = currencyFormated(value);
      this.newItem.price = this.newItem.priceFormated.replace(/[^,\d]/g, '');
    },
    updateHandleInputPrice(value) {
      this.updateMenu.priceFormated = currencyFormated(value);
      this.updateMenu.price = this.updateMenu.priceFormated.replace(/[^,\d]/g, '');
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `Currently, 1 pictures are limited to be selected. This time, it is selected ${files.length} Pictures selected ${
          files.length + fileList.length
        } Pictures`
      );
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (this.imagess.length < 10) {
        this.createImage(files);
      } else {
        this.$message.warning(`Currently, 10 pictures are limited to be selected`);
      }
    },
    createImage(files) {
      var vm = this;
      for (var index = 0; index < files.length; index++) {
        const file = files[index];
        if (isValidImage(file)) {
          if (isAllowedImageSize(file)) {
            uploadImage(file).then(response => {
              vm.imagess.push(response.url);
            });
          } else {
            // need to compress the image here
            compressImage(file).then(response => {
              const compress = response;
              uploadImage(compress).then(res => {
                vm.imagess.push(res.url);
              });
            });
          }
        } else {
          this.$message.error(i18n.t('error_message.picture.format'));
        }
      }
      console.log(this.imagess);
    },
    onFileChange1(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (this.MultipleUrlUpdate.length < 10) {
        this.createImage1(files);
      } else {
        this.$message.warning(`Currently, 10 pictures are limited to be selected`);
      }
    },
    createImage1(files) {
      for (var index = 0; index < files.length; index++) {
        // console.log(files[index]);
        const file = files[index];
        if (isValidImage(file)) {
          if (isAllowedImageSize(file)) {
            uploadImage(file).then(response => {
              this.MultipleUrlUpdate.push(response.url);
            });
          } else {
            // need to compress the image here
            compressImage(file).then(response => {
              const compress = response;
              uploadImage(compress).then(res => {
                this.MultipleUrlUpdate.push(res.url);
              });
            });
          }
        } else {
          this.$message.error(i18n.t('error_message.picture.format'));
        }
      }
      console.log(this.imagess);
    },
    removeImage(index) {
      this.imagess.splice(index, 1);
      console.log(this.imagess);
    },
    removeImage1(index) {
      this.MultipleUrlUpdate.splice(index, 1);
    },
    uploadSectionFile(params) {
      const { file } = params;
      if (isValidImage(file)) {
        if (isAllowedImageSize(file)) {
          uploadImage(file).then(response => {
            this.SingleList = [{ name: response.url, url: response.url }];
            this.image = response.url;
            this.newItem.picture = response.url;
            this.fileListUpdate = [{ name: response.url, url: response.url }];
            this.updateMenu.picture = response.url;
            this.updateUrl = response.url;
          });
        } else {
          // need to compress the image here
          compressImage(file).then(response => {
            const compress = response;
            uploadImage(compress).then(res => {
              this.SingleList = [{ name: res.url, url: res.url }];
              this.image = res.url;
              this.newItem.picture = res.url;
              this.fileListUpdate = [{ name: res.url, url: res.url }];
              this.updateMenu.picture = res.url;
              this.updateUrl = res.url;
            });
          });
        }
      } else {
        this.SingleList = [];
        this.fileListUpdate = [];
        this.$message.error(i18n.t('error_message.picture.format'));
      }
      // console.log(this.SingleList);
    },
    handleRemove1(file) {
      this.SingleList = [];
      this.fileListUpdate = [];
      this.newItem.picture = '';
      this.updateMenu.picture = '';
    },
    //  handleRequest(request) {
    //  const { file } = request;
    //  console.log(file);
    //  if (isValidImage(file)) {
    //    this.isShowImageThumbnail = true;
    //    if (isAllowedImageSize(file)) {
    //      this.handleUploadImage(file);
    //      console.log(this.handleUploadImage);
    //    } else {
    //      compressImage(file).then(response => {
    //        this.handleUploadImage(response);
    //      });
    //    }
    //  } else {
    //    this.isShowImageThumbnail = false;
    //    this.fileList = [];
    //    this.$message.error(i18n.t('error_message.picture.format'));
    //  }
    // },
    // handleUploadImage(file) {
    //  uploadImage(file).then(response => {
    //    this.newItem.picture = response.url;
    //    this.updateMenu.picture = response.url;
    //  })
    //    .catch(error => {
    //      console.log(error);
    //    });
    // },
    // handleRemove(file, fileList) {
    //  this.newItem.picture = '';
    //  this.updateMenu.picture = '';
    // },
    handleFileBeforeUpload(file) {
      const isLt500Kb = file.size / 1024 < 512;
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isXLSX) {
        this.$message.error(i18n.t('error_message.file.format'));
      }
      if (!isLt500Kb) {
        this.$message.error(i18n.t('error_message.file.size'));
      }
      return isXLSX && isLt500Kb;
    },
    handleFileRemove(file, fileList) {
      this.uploadFileUrl = '';
    },
    handleUploadFileSuccess(response, file, fileList) {
      this.uploadFileUrl = response.url;
    },
    handleFileError(err, file, fileList) {
      console.log(err);
    },
    getList() {
      this.loading = true;
      this.query.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
      this.query.store_id = parseInt(atob(localStorage.getItem('store_id')));
      fetchListMenu(this.query).then(response => {
        this.list = response.data;
      });
      this.loading = false;
    },
    handleResetFilter() {
      this.query = {
        page: 1,
        limit: 15,
        name: '',
        category_id: null,
        status: null,
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetnewItem();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['itemForm'].clearValidate();
      });
    },
    handleUpload() {
      this.dialogUploadFormVisible = true;
      this.uploadFileUrl = '';
      this.uploadFileList = [];
    },
    getTemplateFile() {
      getTemplateMenu(parseInt(atob(localStorage.getItem('store_id')))).then(response => {
        window.open(response.filename, '_blank');
      });
    },
    handleUpdate(row) {
      if (row.picture) {
        this.fileListUpdate = [{ name: 'current_picture.jpg', url: row.picture }];
        this.updateUrl = row.picture;
      } else {
        this.fileListUpdate = [];
        this.updateUrl = '';
      }
      if (row.pictures){
        this.MultipleUrlUpdate = row.pictures;
        console.log(this.MultipleUrlUpdate);
      } else {
        this.MultipleUrlUpdate = [];
      }
      this.updateMenu = {
        id: row.id,
        name: row.name,
        is_active: row.is_active,
        picture: row.picture,
        pictures: row.pictures,
        category_id: row.category_id,
        short_desc: row.short_desc,
        description: row.description,
        priceFormated: currencyFormated(row.price),
        price: row.price,
        stock: row.stock,
        weight: row.weight,
        length: row.length,
        width: row.width,
        height: row.height,
      };
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
      });
    },
    handleDetail(row) {
      this.detailMenu = [
        {
          'name': i18n.t('table.name'),
          'value': row.name,
        },
        {
          'name': i18n.t('table.category'),
          'value': this.category[row.category_id],
        },
        {
          'name': i18n.t('table.short_description'),
          'value': row.short_desc,
        },
        {
          'name': i18n.t('table.description'),
          'value': row.description,
        },
        {
          'name': i18n.t('table.status'),
          'value': row.is_active,
        },
        {
          'name': i18n.t('table.picture'),
          'value': row.picture,
        },
        {
          'name': i18n.t('table.pictures'),
          'value': row.pictures,
        },
        {
          'name': i18n.t('table.price'),
          'value': row.price,
        },
        {
          'name': i18n.t('table.stock'),
          'value': row.stock,
        },
        {
          'name': i18n.t('menu.measure.long'),
          'value': row.length,
        },
        {
          'name': i18n.t('menu.measure.tall'),
          'value': row.height,
        },
        {
          'name': i18n.t('menu.measure.wide'),
          'value': row.width,
        },
        {
          'name': i18n.t('menu.measure.heavy'),
          'value': row.weight,
        },
      ];
      this.dialogDetailVisible = true;
    },
    handleDelete(id, name) {
      this.$confirm(i18n.t('modal.delete.confirm.menu', { name: name }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        deleteMenu(id).then(response => {
          this.$message({
            message: i18n.t('menu.toaster.delete.success', { name: name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.handleFilter();
        })
          .catch(error => {
            console.log(error);
            this.$message({
              message: i18n.t('menu.toaster.delete.failed'),
              type: 'error',
              duration: 5 * 1000,
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
    createMenu() {
      this.$refs['itemForm'].validate((valid) => {
        if (valid && this.newItem.picture !== '') {
          this.itemCreating = true;
          this.newItem.merchant_id = parseInt(atob(localStorage.getItem('merchant_id')));
          this.newItem.store_id = parseInt(atob(localStorage.getItem('store_id')));
          this.newItem.price = parseInt(this.newItem.price);
          this.newItem.stock = parseInt(this.newItem.stock);
          this.newItem.width = parseInt(this.newItem.width);
          this.newItem.weight = parseInt(this.newItem.weight);
          this.newItem.length = parseInt(this.newItem.length);
          this.newItem.height = parseInt(this.newItem.height);
          // this.newItem.pictures = this.MultipleList;
          this.newItem.pictures = this.imagess;
          // console.log(this.newItem.pictures);
          createMenu(this.newItem).then(response => {
            // console.log(this.newItem);
            if (!response.message){
              this.$message({
                message: i18n.t('menu.toaster.create.success', { name: this.newItem.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.resetnewItem();
              this.handleFilter();
              this.itemCreating = false;
              this.dialogFormVisible = false;
            } else {
              // console.log(response.message);
              this.$message({
                message: i18n.t('menu.toaster.create.error', { errorMessage: response.message }),
                type: 'error',
                duration: 5 * 1000,
              });
              this.itemCreating = false;
              this.resetnewItem();
            }
          })
            .catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('menu.toaster.create.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            });
        } else {
          this.$message({
            message: i18n.t('error_message.form_not_valid'),
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
    },
    doupdateMenu() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid && this.updateMenu.picture !== '') {
          this.menuUpdating = true;
          this.updateMenu.price = parseInt(this.updateMenu.price);
          this.updateMenu.stock = parseInt(this.updateMenu.stock);
          this.updateMenu.weight = parseInt(this.updateMenu.weight);
          this.updateMenu.width = parseInt(this.updateMenu.width);
          this.updateMenu.height = parseInt(this.updateMenu.height);
          this.updateMenu.length = parseInt(this.updateMenu.length);
          this.updateMenu.pictures = this.MultipleUrlUpdate;
          // console.log(this.MultipleUrlUpdate);
          updateMenu(this.updateMenu)
            .then(response => {
              if (!response.message){
                this.$message({
                  message: i18n.t('menu.toaster.update.success', { name: this.updateMenu.name }),
                  type: 'success',
                  duration: 5 * 1000,
                });
                this.dialogUpdateFormVisible = false;
                this.menuUpdating = false;
                this.handleFilter();
              } else {
                this.$message({
                  message: i18n.t('menu.toaster.update.error', { errorMessage: response.message }),
                  type: 'error',
                  duration: 5 * 1000,
                });
                this.menuUpdating = false;
              }
            }).catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('menu.toaster.update.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
              this.menuUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
        } else {
          this.$message({
            message: i18n.t('error_message.form_not_valid'),
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      });
    },
    doChangeStatus(row) {
      updateMenu(row)
        .then(reponse => {
          this.$message({
            message: i18n.t('menu.toaster.update.success', { name: row.name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.dialogUpdateFormVisible = false;
          this.handleFilter();
        }).catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('menu.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    doUploadMenu() {
      var data = {
        'url': this.uploadFileUrl,
      };
      uploadMenu(parseInt(atob(localStorage.getItem('store_id'))), data).then(response => {
        if (!response.message) {
          this.$message({
            message: i18n.t('menu.toaster.upload.success'),
            type: 'success',
            duration: 5 * 1000,
          });
          this.dialogUploadFormVisible = false;
          this.handleFilter();
        } else {
          this.$message({
            message: i18n.t('menu.toaster.upload.failed', { errorMessage: response.message }),
            type: 'error',
            duration: 5 * 1000,
          });
        }
      }).catch(error => {
        console.log(error);
        this.$message({
          message: i18n.t('menu.toaster.upload.failed'),
          type: 'error',
          duration: 5 * 1000,
        });
      });
    },
    resetnewItem() {
      this.fileList = [];
      this.SingleList = [];
      this.image = '';
      this.newItem.picture = '';
      this.newItem = {
        name: '',
        category_id: null,
        short_desc: '',
        description: '',
        is_active: false,
        picture: '',
        priceFormated: 0,
        price: 0,
        stock: 0,
        length: 0,
        height: 0,
        weight: 0,
        width: 0,
        pictures: [],
      };
      this.selectedProduct = [];
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleSelectedProduct(id){
      if (this.selectedProduct.includes(id) === true) {
        const index = this.selectedProduct.indexOf(id);
        this.selectedProduct.splice(index, 1);
      } else {
        this.selectedProduct.push(id);
      }
      // console.log(this.selectedProduct, 'data hapus');
    },
    handleMultipeDelete(){
      const dataDelete = {
        id: this.selectedProduct,
      };
      this.$confirm(i18n.t('modal.delete.confirm.menu', { name: name }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        if (this.selectedProduct.length > 0) {
          deleteMenuMultiple(dataDelete).then(response => {
            this.$message({
              message: i18n.t('menu.toaster.delete.success', { name: name }),
              type: 'success',
              duration: 5 * 1000,
            });
            location.reload();
          })
            .catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('menu.toaster.delete.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            });
          // console.log(dataDelete, 'data delete');
        } else {
          this.$message({
            message: 'Tidak ada produk terpilih',
            type: 'error',
            duration: 5 * 1000,
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: i18n.t('toaster.delete.cancel'),
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: left;
  padding-top: 0;
  margin-left: 150px;
}
.app-container {
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
}

.filter-item-search,
.filter-item-category {
    width: 150px;
}

.filter-item-status {
    width: 100px;
    margin-right: 8px;
}

.action-add-button {
  button:first-child {
    margin-right: 10px;
  }
}

ul#preview {
   list-style: none;
   margin: 25px auto;
   padding: 0;
   display: block;
   max-width: 600px;
}

ul#preview li {
   display: inline-block;
   margin: 0 10px 10px;
   max-width: 100px;
}

ul#preview li img {
   width: 100%;
}

.uploaded_file_view {
  max-width: 300px;
  margin: 40px auto;
  text-align: center;
  position: relative;
  transition: .2s;
  border: 2px solid #ddd;
  padding: 15px;
}
.file_remove{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: block;
  position: absolute;
  background: #aaa;
  line-height: 30px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  right: -15px;
  top: -15px;
}
.file_remove:hover {
  background: #222;
  transition: .2s;
}
.uploaded_file_view img {
  max-width: 100%;
}

</style>
