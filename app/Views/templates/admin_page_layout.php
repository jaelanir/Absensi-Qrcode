<!DOCTYPE html>
<html lang="en">

<?= $this->include('templates/head') ?>

<body>
   <!-- Loading Overlay -->
   <div class="loading-overlay">
      <div class="text-center text-white">
         <div class="spinner-border text-light mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="sr-only">Loading...</span>
         </div>
         <p>Memproses...</p>
      </div>
   </div>
   
   <div>
      <?= $this->include('templates/sidebar') ?>
      <div class="main-panel">

         <?= $this->include('templates/navbar') ?>

         <?= $this->renderSection('content') ?>

         <?= $this->include('templates/footer') ?>

         <!-- komentar jika tidak dipakai -->
         <?php
         // echo $this->include('templates/fixed_plugin') 
         ?>

      </div>
   </div>
</body>

</html>