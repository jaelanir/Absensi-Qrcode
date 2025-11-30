<?= $this->extend('templates/admin_page_layout') ?>
<?= $this->section('content') ?>
<div class="content">
   <div class="container-fluid">
      <div class="row">
         <div class="col-lg-12 col-md-12">
            <?php if (session()->getFlashdata('msg')) : ?>
               <div class="pb-2 px-3">
                  <div class="alert alert-<?= session()->getFlashdata('error') == true ? 'danger' : 'success'  ?> ">
                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <i class="material-icons">close</i>
                     </button>
                     <?= session()->getFlashdata('msg') ?>
                  </div>
               </div>
            <?php endif; ?>
            <div class="row">
               <div class="col-12 col-xl-12">
                  <div class="card">
                     <div class="card-header card-header-tabs card-header-info">
                        <div class="nav-tabs-navigation">
                           <div class="row">
                              <div class="col-md-4 col-lg-5">
                                 <h4 class="card-title"><b>Daftar Petugas</b></h4>
                                 <p class="card-category">Petugas absensi</p>
                              </div>
                              <div class="ml-md-auto col-auto row">
                                 <div class="col-12 col-sm-auto nav nav-tabs">
                                    <div class="nav-item">
                                       <a class="nav-link" id="tabBtn" onclick="removeHover();" href="<?= base_url('admin/petugas/register'); ?>">
                                          <i class="material-icons">add</i> Tambah data petugas
                                          <div class="ripple-container"></div>
                                       </a>
                                    </div>
                                 </div>
                                 <div class="col-12 col-sm-auto nav nav-tabs">
                                    <div class="nav-item">
                                       <a class="nav-link" id="refreshBtn" onclick="getDataPetugas()" href="#" data-toggle="tab">
                                          <i class="material-icons">refresh</i> Refresh
                                          <div class="ripple-container"></div>
                                       </a>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div id="dataPetugas">
                        <p class="text-center mt-3">Daftar petugas muncul disini</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
<script>
   var kelas = null;
   var jurusan = null;

   getDataPetugas();

   function getDataPetugas() {
      showLoading('#dataPetugas');
      
      jQuery.ajax({
         url: "<?= base_url('/admin/petugas'); ?>",
         type: 'post',
         headers: {
            'X-Requested-With': 'XMLHttpRequest'
         },
         data: {},
         success: function(response, status, xhr) {
            try {
               $('#dataPetugas').html(response);
               removeHover();
               $('html, body').animate({
                  scrollTop: $("#dataPetugas").offset().top
               }, 500);
            } catch (e) {
               console.error('Error displaying data:', e);
               handleAjaxError(null, 'parse', 'Gagal menampilkan data', '#dataPetugas');
            }
         },
         error: function(xhr, status, thrown) {
            handleAjaxError(xhr, status, thrown, '#dataPetugas', 'Gagal memuat data petugas');
            $('#dataPetugas').html(thrown);
         }
      });
   }

   function removeHover() {
      setTimeout(() => {
         $('#tabBtn').removeClass('active show');
         $('#refreshBtn').removeClass('active show');
      }, 250);
   }
</script>
<?= $this->endSection() ?>