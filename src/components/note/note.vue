<template>
  <div>
    <perm label="noticeAdd">
      <div align="right" style="padding-right: 30px">
        <el-tooltip class="item" effect="dark" content="新增" placement="top">
          <el-button size="small" icon="el-icon-circle-plus" circle @click="addNotice"></el-button>
        </el-tooltip>
      </div>
    </perm>
    <el-collapse v-model="activeNames" :accordion="true">
      <template v-for="(note,index) of noteList">
        <el-collapse-item :name="index" :key="index">
          <template slot="title">
            <div style="width: 100%; text-align: center">{{note.noteTitle}}
              <el-tag v-if="note.noteType === '1'" size="mini" type="success">已发布</el-tag>
              <el-tag v-else size="mini" type="info">未发布</el-tag>
            </div>
          </template>
          <div style="border: 1px solid #a2c9f5 ;background-color: #edf5fe;border-radius: 10px ; margin: 10px; box-shadow: 2px 3px #a2c9f5;">
            <div align="right">
              <div v-if="note.noteType === '0'">
                <el-tooltip class="item" effect="dark" content="发布" placement="top">
                  <el-button size="mini" circle icon="el-icon-refresh" type="success"
                             @click="pushNote(note)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button size="mini" circle icon="el-icon-delete" type="danger"
                             @click="deleteNote(note)"></el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-tooltip class="item" effect="dark" content="停用" placement="top">
                  <el-button size="mini" circle icon="el-icon-refresh" type="info" @click="pushNote(note)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button size="mini" circle icon="el-icon-delete" type="danger"
                             @click="deleteNote(note)"></el-button>
                </el-tooltip>
              </div>
            </div>
            <!--<div align="center" style="padding: 20px;font-size: 2rem; font-family: 'Kaiti SC'">-->
              <!--<span>{{note.noteTitle}}</span>-->
            <!--</div>-->
            <div>
              <p style="text-indent:2em; padding: 20px 20%; font-size: 1.5rem; font-family: 'Kaiti SC';">{{note.noteContent}}</p>
            </div>
            <div align="right" style="padding: 10px 15%;"><span>发布人: {{note.noteCreated}}</span> <span>发布时间: {{$dateFmt('yyyy-MM-dd hh:mm:ss',note.noteModifytime )}}</span>
            </div>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
    <page-right v-show="showNoteAdd" @rightClose="rightClose">
      <note-form v-show="showNoteAdd" @right-Close="rightClose"></note-form>
    </page-right>
  </div>
</template>

<script>
  import noteForm from './noteform.vue';
  import pageRight from '../common/self-pageright.vue';
  import perm from '../common/self-perm.vue';

  export default {
    components: {
      noteForm: noteForm,
      pageRight: pageRight,
      perm: perm,
    },
    name: 'note',
    data() {
      return {
        showNoteAdd: false,
        noteList: [],
        activeNames: [0]
      };
    },
    mounted() {
      this.getNote();
    },
    methods: {
      getNote() {
        this.$api.post(this.$HOST + '/note/listNoteAll').then((res) => {
          this.noteList = res;
        });
      },
      addNotice() {
        this.showNoteAdd = true;
      },
      deleteNote(note) {
        this.$api.post(this.$HOST + '/note/deleteNote/' + note.noteId).then((res) => {
          if (res === 'true') {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '删除成功'
            })
          }
          this.getNote();
        });
      },
      pushNote(note) {
        let status = note.noteType;
        if (status === '1') {
          note.noteType = '0';
        } else {
          note.noteType = '1';
        }
        let formDate = JSON.parse(JSON.stringify(note));
        this.$api.post(this.$HOST + '/note/editNote/' + note.noteId, formDate).then((res) => {
          this.getNote();
        });
      },
      rightClose() {
        this.showNoteAdd = false;
        this.getNote();
      }
    }
  };
</script>

<style scoped>

</style>
