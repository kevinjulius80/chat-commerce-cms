<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-col-6">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          {{ $t('merchant.add') }}
        </el-button>
      </div>
      <div class="el-col-18" style="text-align: right">
        <el-input
          v-model="query.name"
          :placeholder="$t('table.keyword')"
          style="width: 200px; margin-right: 12px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item" type="secondary" @click="handleReset">
          {{ $t('table.reset') }}
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
      </div>
    </div>
    <br>
    <br>
    <!-- TABLE -->
    <div class="table-wrapper">
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%; border-collapse: collapse;">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.name')" prop="name" />

        <el-table-column align="center" :label="$t('merchant.code')" prop="code" />

        <el-table-column align="center" :label="$t('table.actions')" width="350">
          <template slot-scope="scope">
            <el-button
              v-permission="['manage merchant']"
              type="default"
              size="small"
              icon="el-icon-data-analysis"
              @click="handleDetail(scope.row)"
            />
            <el-button
              v-permission="['manage merchant']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            />
            <el-button
              v-permission="['manage merchant']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id, scope.row.name);"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
      <br>
    </div>
    <!-- CREATE -->
    <el-dialog :title="$t('merchant.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="merchantCreating" class="form-container">
        <el-form
          ref="merchantForm"
          :rules="rules"
          :model="newMerchant"
          label-position="left"
          label-width="250px"
        >
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="newMerchant.name" />
          </el-form-item>
          <el-form-item :label="$t('merchant.code')" prop="code">
            <el-input v-model="newMerchant.code" />
          </el-form-item>
          <el-form-item :label="$t('merchant.username')" prop="client_username">
            <el-input v-model="newMerchant.client_username" />
          </el-form-item>
          <el-form-item :label="$t('merchant.password')" prop="client_password">
            <el-input v-model="newMerchant.client_password" />
          </el-form-item>
          <el-form-item :label="$t('merchant.notif_username')" prop="notif_client_username">
            <el-input v-model="newMerchant.notif_client_username" />
          </el-form-item>
          <el-form-item :label="$t('merchant.notif_password')" prop="notif_client_password">
            <el-input v-model="newMerchant.notif_client_password" />
          </el-form-item>
          <el-form-item :label="$t('merchant.wa_template_namespace')" prop="wa_template_namespace">
            <el-input v-model="newMerchant.wa_template_namespace" />
          </el-form-item>
          <el-form-item :label="$t('merchant.wa_template_name')" prop="wa_template_name">
            <el-input v-model="newMerchant.wa_template_name" />
          </el-form-item>
          <el-form-item :label="$t('merchant.phone_number')" prop="phone_number">
            <el-input v-model="newMerchant.phone_number" />
          </el-form-item>
          <el-form-item :label="$t('merchant.social_media_url')" prop="social">
            <el-input v-model="newMerchant.social" />
          </el-form-item>
          <el-form-item :label="$t('merchant.platform_fee')" prop="platform_fee">
            <el-input v-model="platformFeeFormated" class="input-with-prefix" @input="handleCreateInputPlatformFee">
              <template slot="prepend">Rp</template>
            </el-input>
          </el-form-item>
          <h3>{{ $t('merchant.message') }} :</h3>
          <el-form-item :label="$t('merchant.greeting.header')" prop="message.greeting_header">
            <el-input v-model="newMerchant.message.greeting_header" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*":user_name" variable will be replaced by customer name</p>
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.greeting.body')" prop="message.greeting_body">
            <el-input v-model="newMerchant.message.greeting_body" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*":social" variable will be replaced by merchant social link</p>
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.helper')" prop="message.help_text">
            <el-input v-model="newMerchant.message.help_text" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.qr_link')" prop="message.qr_link">
            <el-input v-model="newMerchant.message.qr_link" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*qr code picture link</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.share_message')" prop="message.share_message">
            <el-input v-model="newMerchant.message.share_message" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createMerchant()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- UPDATE -->
    <el-dialog :title="$t('merchant.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="merchantUpdating" class="form-container">
        <el-form
          ref="updateForm"
          :rules="rules"
          :model="updateMerchant"
          label-position="left"
          label-width="250px"
        >
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input v-model="updateMerchant.name" />
          </el-form-item>
          <el-form-item :label="$t('merchant.code')" prop="code">
            <el-input v-model="updateMerchant.code" />
          </el-form-item>
          <el-form-item :label="$t('merchant.username')" prop="client_username">
            <el-input v-model="updateMerchant.client_username" />
          </el-form-item>
          <el-form-item :label="$t('merchant.password')" prop="client_password">
            <el-input v-model="updateMerchant.client_password" />
          </el-form-item>
          <el-form-item :label="$t('merchant.notif_username')" prop="notif_client_username">
            <el-input v-model="updateMerchant.notif_client_username" />
          </el-form-item>
          <el-form-item :label="$t('merchant.notif_password')" prop="notif_client_password">
            <el-input v-model="updateMerchant.notif_client_password" />
          </el-form-item>
          <el-form-item :label="$t('merchant.wa_template_namespace')" prop="wa_template_namespace">
            <el-input v-model="updateMerchant.wa_template_namespace" />
          </el-form-item>
          <el-form-item :label="$t('merchant.wa_template_name')" prop="wa_template_name">
            <el-input v-model="updateMerchant.wa_template_name" />
          </el-form-item>
          <el-form-item :label="$t('merchant.phone_number')" prop="phone_number">
            <el-input v-model="updateMerchant.phone_number" />
          </el-form-item>
          <el-form-item :label="$t('merchant.social_media_url')" prop="social">
            <el-input v-model="updateMerchant.social" />
          </el-form-item>
          <el-form-item :label="$t('merchant.platform_fee')" prop="platform_fee">
            <el-input v-model="platformFeeFormated" class="input-with-prefix" @input="handleUpdateInputPlatformFee">
              <template slot="prepend">Rp</template>
            </el-input>
          </el-form-item>
          <h3>{{ $t('merchant.message') }} :</h3>
          <el-form-item :label="$t('merchant.greeting.header')" prop="message.greeting_header">
            <el-input v-model="updateMerchant.message.greeting_header" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*":user_name" variable will be replaced by customer name</p>
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.greeting.body')" prop="message.greeting_body">
            <el-input v-model="updateMerchant.message.greeting_body" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*":social" variable will be replaced by merchant social link</p>
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.helper')" prop="message.help_text">
            <el-input v-model="updateMerchant.message.help_text" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.qr_link')" prop="message.qr_link">
            <el-input v-model="updateMerchant.message.qr_link" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*qr code picture link</p>
          </el-form-item>
          <el-form-item :label="$t('merchant.share_message')" prop="message.share_message">
            <el-input v-model="updateMerchant.message.share_message" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
            <p style="color: red; margin: 0; padding: 0;">*use \n for enter</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doupdateMerchant()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- DETAIL -->
    <el-dialog :visible.sync="dialogDetailVisible" :title="$t('merchant.detail')" :custom-class="'rounded-border'">
      <el-table :data="detailMerchant" :show-header="false">
        <el-table-column :label="$t('table.name')" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Value">
          <template slot-scope="scope">
            <span v-if="scope.row.name == $t('merchant.platform_fee')">
              {{ scope.row.value | price_format }}
            </span>
            <span v-else>
              {{ scope.row.value }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="refreshWebhook">{{ $t('merchant.button_refresh_webhook') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import {
  createMerchant,
  fetchListMerchant,
  getMerchant,
  updateMerchant,
  deleteMerchant,
  refreshWebhook,
} from '@/api/merchant';
import UserResource from '@/api/user';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import i18n from '@/lang';
import currencyFormated from '@/utils/currencyFormated';

const userResource = new UserResource();

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
      list: [],
      userOptions: [],
      options: [],
      category: [],
      total: Infinity,
      loading: true,
      downloading: false,
      merchantCreating: false,
      merchantUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: null,
      },
      dummyQuery: {
        page: 1,
        limit: 15,
      },
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      rules: {
        name: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        code: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        client_username: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        client_password: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        notif_client_username: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        notif_client_password: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        wa_template_namespace: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        wa_template_name: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        phone_number: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        social: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        platform_fee: [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        'message.greeting_body': [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        'message.greeting_header': [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        'message.help_text': [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        'message.qr_link': [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
        'message.share_message': [{ required: true, message: i18n.t('error_message.required'), trigger: 'change' }],
      },
      currentId: 0,
      newMerchant: {},
      updateMerchant: {
        message: {},
      },
      detailMerchant: [],
      isSuccessCreatedMerchant: false,
      platformFeeFormated: '0',
    };
  },
  created() {
    this.resetnewMerchant();
    this.getList();
  },
  methods: {
    handleCreateInputPlatformFee(value) {
      this.platformFeeFormated = currencyFormated(value);
      this.newMerchant.platform_fee = this.platformFeeFormated.replace(/[^,\d]/g, '');
    },
    handleUpdateInputPlatformFee(value) {
      this.platformFeeFormated = currencyFormated(value);
      this.updateMerchant.platform_fee = this.platformFeeFormated.replace(/[^,\d]/g, '');
    },
    setDescription(description) {
      this.description = description;
    },
    async getList() {
      this.loading = true;
      fetchListMerchant(this.query).then(response => {
        this.list = response.data;
      })
        .finally(() => {
          if (this.isSuccessCreatedMerchant) {
            this.assignMerchantPermission(this.list[0].id);
          }
        });
      this.loading = false;
    },
    handleReset() {
      this.query = {
        page: 1,
        limit: 15,
        name: null,
        city: null,
        address: null,
        status: null,
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetnewMerchant();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['merchantForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      getMerchant(row.id).then(response => {
        this.updateMerchant = {
          id: response.data.id,
          name: response.data.name,
          code: response.data.code,
          client_username: response.data.client_username,
          client_password: response.data.client_password,
          notif_client_username: response.data.notif_client_username,
          notif_client_password: response.data.notif_client_password,
          wa_template_namespace: response.data.wa_template_namespace,
          wa_template_name: response.data.wa_template_name,
          phone_number: response.data.phone_number,
          social: response.data.social,
          platform_fee: response.data.platform_fee,
          message: response.data.message,
        };
        this.platformFeeFormated = currencyFormated(this.updateMerchant.platform_fee);
        this.dialogUpdateFormVisible = true;
        this.$nextTick(() => {
          this.$refs['updateForm'].clearValidate();
        });
      });
    },
    handleDetail(row) {
      getMerchant(row.id).then(response => {
        this.currentId = row.id;
        this.updateMerchant = {
          id: response.data.id,
          name: response.data.name,
          code: response.data.code,
          client_username: response.data.client_username,
          client_password: response.data.client_password,
          notif_client_username: response.data.notif_client_username,
          notif_client_password: response.data.notif_client_password,
          wa_template_namespace: response.data.wa_template_namespace,
          wa_template_name: response.data.wa_template_name,
          phone_number: response.data.phone_number,
          social: response.data.social,
          platform_fee: response.data.platform_fee,
          message: response.data.message,
        };
        this.detailMerchant = [
          {
            'name': i18n.t('table.name'),
            'value': response.data.name,
          },
          {
            'name': i18n.t('merchant.code'),
            'value': response.data.code,
          },
          {
            'name': i18n.t('merchant.username'),
            'value': response.data.client_username,
          },
          {
            'name': i18n.t('merchant.password'),
            'value': response.data.client_password,
          },
          {
            'name': i18n.t('merchant.notif_username'),
            'value': response.data.notif_client_username,
          },
          {
            'name': i18n.t('merchant.notif_password'),
            'value': response.data.notif_client_password,
          },
          {
            'name': i18n.t('merchant.wa_template_namespace'),
            'value': response.data.wa_template_namespace,
          },
          {
            'name': i18n.t('merchant.wa_template_name'),
            'value': response.data.wa_template_name,
          },
          {
            'name': i18n.t('merchant.phone_number'),
            'value': response.data.phone_number,
          },
          {
            'name': i18n.t('merchant.social_media_url'),
            'value': response.data.social,
          },
          {
            'name': i18n.t('merchant.platform_fee'),
            'value': response.data.platform_fee,
          },
          {
            'name': 'Message :',
            'value': '',
          },
          {
            'name': i18n.t('merchant.greeting.header'),
            'value': response.data.message.greeting_header,
          },
          {
            'name': i18n.t('merchant.greeting.body'),
            'value': response.data.message.greeting_body,
          },
          {
            'name': i18n.t('merchant.helper'),
            'value': response.data.message.help_text,
          },
          {
            'name': i18n.t('merchant.qr_link'),
            'value': response.data.message.qr_link,
          },
          {
            'name': i18n.t('merchant.share_message'),
            'value': response.data.message.share_message,
          },
        ];
        this.dialogDetailVisible = true;
      });
    },
    handleDelete(id, name) {
      this.$confirm(i18n.t('modal.delete.confirm.merchant', { name: name }), i18n.t('modal.warning'), {
        confirmButtonText: i18n.t('modal.button.ok'),
        cancelButtonText: i18n.t('modal.button.cancel'),
        type: 'warning',
      }).then(() => {
        deleteMerchant(id).then(response => {
          this.$message({
            message: i18n.t('merchant.toaster.delete.success', { name: name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.revokeMerchantPermission(id);
          this.handleFilter();
        })
          .catch(error => {
            console.log(error);
            this.$message({
              message: i18n.t('merchant.toaster.delete.failed'),
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
    createMerchant() {
      this.$refs['merchantForm'].validate((valid) => {
        if (valid) {
          this.merchantCreating = true;
          createMerchant(this.newMerchant).then(response => {
            if (response.error) {
              this.$message({
                message: i18n.t('merchant.toaster.create.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
              return;
            }
            this.$message({
              message: i18n.t('merchant.toaster.create.success', { name: this.newMerchant.name }),
              type: 'success',
              duration: 5 * 1000,
            });
            this.isSuccessCreatedMerchant = true;
            this.resetnewMerchant();
            this.handleFilter();
          })
            .catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('merchant.toaster.create.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.merchantCreating = false;
              this.dialogFormVisible = false;
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
    doupdateMerchant() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.merchantUpdating = true;
          updateMerchant(this.updateMerchant)
            .then(response => {
              if (response.error) {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 5 * 1000,
                });
                return;
              }
              this.$message({
                message: i18n.t('merchant.toaster.update.success', { name: this.updateMerchant.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            }).catch(error => {
              console.log(error);
              this.$message({
                message: i18n.t('merchant.toaster.update.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            }).finally(() => {
              this.merchantUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
        } else {
          this.$message({
            message: i18n.t('error_message.form_not_valid'),
            type: 'error',
            duration: 5 * 1000,
          }); return false;
        }
      });
    },
    resetnewMerchant() {
      this.newMerchant = {
        name: '',
        code: '',
        client_username: '',
        client_password: '',
        notif_client_username: '',
        notif_client_password: '',
        wa_template_namespace: '',
        wa_template_name: '',
        phone_number: '',
        social: '',
        platform_fee: '',
        message: {
          greeting_body: 'Untuk mendapatkan informasi promo ikuti social media kami:\\n:social\\nSilahkan pilih menu dibawah untuk order ataupun mengetahui informasi lainnya',
          greeting_header: 'Halo :user_name, Selamat Datang!!',
          help_text: 'Untuk bantuan CS, dapat menghubungi ke WA: https://wa.me/628xxxx?text=jatis',
          qr_link: 'https://id.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/basic_market/generator/dist/generator/assets/images/websiteQRCode_noFrame.png',
          share_message: 'Hi, untuk order sudah dapat dengan mudah untuk memesan melalui https://wa.me/6287806666226.',
        },
      };
      this.markers = [];
      this.center = { lat: -6.176166, lng: 106.826247 };
    },
    refreshWebhook() {
      refreshWebhook(this.currentId).then(response => {
        this.$message({
          message: i18n.t('merchant.webhook.success'),
          type: 'success',
          duration: 5 * 1000,
        });
        this.handleFilter();
      })
        .catch(error => {
          console.log(error);
          this.$message({
            message: i18n.t('merchant.webhook.error'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    assignMerchantPermission(merchantId) {
      userResource
        .assignMerchantPermission(merchantId)
        .then()
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.isSuccessCreatedMerchant = false;
          location.reload();
        });
    },
    revokeMerchantPermission(merchantId) {
      userResource
        .revokeMerchantPermission(merchantId)
        .then()
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          location.reload();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.dialog-footer {
  text-align: left;
  padding-top: 0;
  margin-left: 150px;
}

.app-container {
  flex: 1;
  justify-content: space-between;
  font-size: 14px;

  .block {
    float: left;
    min-width: 250px;
  }

  .clear-left {
    clear: left;
  }
}
</style>
