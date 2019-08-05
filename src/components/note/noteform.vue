<template>
  <div style="width: 600px;">
    <div style="border: 1px solid #eee;margin: 10px;" v-show="!showNoteList">
      <div align="center" style="padding: 20px 20%;">
        标题<el-input placeholder="请输入标题" v-model="note.noteTitle"></el-input>
      </div>
      <div align="center" style="padding: 20px 5%;">
        内容<el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容" v-model="note.noteContent"></el-input>
      </div>
      <div align="right">
        <el-button size="small" type="primary" plain @click="addNote">提交</el-button>
        <el-button size="small" plain @click="stopAdd">取消</el-button>
      </div>
    </div>
    <div v-show="showNoteList">
      <div style="border: 1px solid #eee;margin: 10px; background-color: #edf5fe">
        <div align="center" style="padding: 20px;font-size: 2rem;"><span>{{resNote.noteTitle}}</span></div>
        <div>
          <p style="text-indent:2em; padding: 20px 20%; font-size: 1.5rem;">{{resNote.noteContent}}</p>
        </div>
        <div align="right" style="padding: 10px 15%;"><span>发布人: {{resNote.noteCreated}}</span> <span>发布时间: {{$dateFmt('yyyy-MM-dd hh:mm:ss',resNote.noteCreatetime )}}</span></div>
      </div>
      <div align="right">
        <el-button size="small" plain  type="primary" @click="pushNote">发布</el-button>
        <el-button size="small" plain @click="stopPush">暂不发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'noteform',
    data () {
      return {
        note: {
          noteContent: '',
          noteCreated: this.$store.state.user.userName,
          noteTitle: '',
          noteType: '0'
        },
        resNote: {
          noteTitle: '',
          noteContent: '',
          noteCreated: '',
          noteCreatetime: ''
        },
        showNoteList: false
      }
    },
    methods: {
      resetNote (){
        this.note.noteContent = '',
        this.note.noteTitle = '',
        this.note.noteType = '0'
      },
      addNote() {
        if (!this.note.noteTitle){
          this.$notify({
            title: '提示！',
            message: '请输入标题',
            type: 'warning'
          });
          return null;
        }
        if (!this.note.noteContent){
          this.$notify({
            title: '提示！',
            message: '请输入内容',
            type: 'warning'
          });
          return null;
        }
        let note = JSON.parse(JSON.stringify(this.note));
        this.api.post(this.HOST + '/note/addNote',note).then((res) => {
          this.resNote = res;
          this.showNoteList = true;
          this.resetNote();
        })
      },
      pushNote() {
        this.resNote.noteType = 1;
        let note = JSON.parse(JSON.stringify(this.resNote));
        this.api.post(this.HOST + '/note/editNote/' + this.resNote.noteId, note).then((res) => {
          this.stopPush();
        });
      },
      stopPush() {
        this.showNoteList = false;
        this.stopAdd();
      },
      stopAdd() {
        this.$emit('right-Close')
      }
    }
  };
</script>

<style scoped>

</style>
