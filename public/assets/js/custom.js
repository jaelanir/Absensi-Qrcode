// Simplified - tidak perlu CSRF token lagi
function setAjaxData(object = null) {
  var data = {};
  if (object != null) {
    Object.assign(data, object);
  }
  return data;
}

// Global error handler untuk AJAX
function handleAjaxError(xhr, status, thrown, targetElement, defaultMessage) {
  console.error('AJAX Error:', {
    status: status,
    thrown: thrown,
    response: xhr.responseText
  });
  
  var errorMessage = defaultMessage || 'Terjadi kesalahan saat memproses data.';
  
  if (xhr.status === 403) {
    errorMessage = 'Akses ditolak. Silakan refresh halaman dan coba lagi.';
  } else if (xhr.status === 404) {
    errorMessage = 'Halaman tidak ditemukan.';
  } else if (xhr.status === 500) {
    errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
  } else if (xhr.responseJSON && xhr.responseJSON.message) {
    errorMessage = xhr.responseJSON.message;
  }
  
  if (targetElement) {
    $(targetElement).html('<div class="alert alert-danger"><i class="material-icons">error</i> ' + errorMessage + '</div>');
  } else {
    alert(errorMessage);
  }
}

// Loading indicator
function showLoading(element) {
  if (element) {
    $(element).html('<div class="text-center mt-3"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div><p class="mt-2">Memuat data...</p></div>');
  }
}

function setSerializedData(serializedData) {
  // Simplified - tidak perlu CSRF token lagi
  return serializedData;
}

//delete item
function deleteItem(url, id, message) {
  swal({
    text: message,
    icon: "warning",
    buttons: [BaseConfig.textCancel, BaseConfig.textOk],
    dangerMode: true,
  }).then(function (willDelete) {
    if (willDelete) {
      var data = {
        'id': id,
      };
      $.ajax({
        type: 'POST',
        url: BaseConfig.baseURL + url,
        data: setAjaxData(data),
        beforeSend: function() {
          $('.loading-overlay').addClass('show');
        },
        success: function (response) {
          swal({
            text: 'Data berhasil dihapus',
            icon: "success",
            button: "Ok"
          }).then(function() {
            location.reload();
          });
        },
        error: function (xhr, status, thrown) {
          $('.loading-overlay').removeClass('show');
          handleAjaxError(xhr, status, thrown, null, 'Gagal menghapus data');
        },
        complete: function() {
          $('.loading-overlay').removeClass('show');
        }
      });
    }
  });
};

function fetchKelasJurusanData(type, target) {
  const url = type === 'kelas' ? BaseConfig.baseURL + 'admin/kelas/list-data' : BaseConfig.baseURL + 'admin/jurusan/list-data';
  const textProcessing = type === 'kelas' ? 'Daftar kelas muncul disini' : 'Daftar Jurusan muncul disini';

  showLoading(target);

  $.ajax({
    url: url,
    type: 'post',
    data: setAjaxData({}),
    success: function (response) {
      try {
        const obj = JSON.parse(response);
        if (obj.result === 1) {
          $(target).html(obj.htmlContent);
        } else {
          $(target).html('<div class="alert alert-info text-center mt-3"><i class="material-icons">info</i> Data tidak ditemukan</div>');
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        handleAjaxError(null, 'parse', 'Gagal memproses data', target);
      }
    },
    error: function (xhr, status, thrown) {
      handleAjaxError(xhr, status, thrown, target, 'Gagal memuat data');
    }
  });
}

//delete selected posts
function deleteSelectedSiswa(message) {
  var siswaIds = [];
  $("input[name='checkbox-table']:checked").each(function () {
      siswaIds.push(this.value);
  });
  
  if (siswaIds.length === 0) {
      swal({
          text: 'Pilih data yang akan dihapus terlebih dahulu',
          icon: "warning",
          button: "Ok"
      });
      return;
  }
  
  swal({
      text: message,
      icon: "warning",
      buttons: [BaseConfig.textCancel, BaseConfig.textOk],
      dangerMode: true,
  }).then(function (willDelete) {
      if (willDelete) {
          var data = {
              'siswa_ids': siswaIds,
          };
          $.ajax({
              type: 'POST',
              url: BaseConfig.baseURL + '/admin/siswa/deleteSelectedSiswa',
              data: setAjaxData(data),
              beforeSend: function() {
                  $('.loading-overlay').addClass('show');
              },
              success: function (response) {
                  swal({
                      text: 'Data berhasil dihapus',
                      icon: "success",
                      button: "Ok"
                  }).then(function() {
                      location.reload();
                  });
              },
              error: function(xhr, status, thrown) {
                  $('.loading-overlay').removeClass('show');
                  handleAjaxError(xhr, status, thrown, null, 'Gagal menghapus data siswa');
              },
              complete: function() {
                  $('.loading-overlay').removeClass('show');
              }
          });
      }
  });
};

$(document).on('click', '#checkAll', function () {
  $('input:checkbox').not(this).prop('checked', this.checked);
});

$(document).on('click', '.checkbox-table', function () {
  if ($(".checkbox-table").is(':checked')) {
    $(".btn-table-delete").show();
  } else {
    $(".btn-table-delete").hide();
  }
});

// Realtime Date and Time Function - DISABLED
// function updateRealtimeDateTime() {
//   const now = new Date();
//   
//   // Format tanggal Indonesia
//   const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//   const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
//                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
//   
//   const dayName = days[now.getDay()];
//   const date = now.getDate();
//   const monthName = months[now.getMonth()];
//   const year = now.getFullYear();
//   
//   const formattedDate = dayName + ', ' + date + ' ' + monthName + ' ' + year;
//   
//   // Format waktu
//   const hours = String(now.getHours()).padStart(2, '0');
//   const minutes = String(now.getMinutes()).padStart(2, '0');
//   const seconds = String(now.getSeconds()).padStart(2, '0');
//   const formattedTime = hours + ':' + minutes + ':' + seconds;
//   
//   // Update navbar (admin page layout)
//   if ($('#realtimeDate').length) {
//     $('#realtimeDate').text(formattedDate);
//     $('#realtimeTime').text(formattedTime);
//   }
//   
//   // Update dashboard cards
//   if ($('#realtimeDateCard1').length) {
//     $('#realtimeDateCard1').text(formattedDate);
//     $('#realtimeTimeCard1').text('| ' + formattedTime);
//   }
//   if ($('#realtimeDateCard2').length) {
//     $('#realtimeDateCard2').text(formattedDate);
//     $('#realtimeTimeCard2').text('| ' + formattedTime);
//   }
//   
//   // Update scan page
//   if ($('#realtimeDateScan').length) {
//     $('#realtimeDateScan').text(formattedDate);
//   }
//   if ($('#realtimeTimeScan').length) {
//     $('#realtimeTimeScan').text(formattedTime);
//   }
//   
//   // Update starting page layout navbar
//   if ($('#realtimeDateNav').length) {
//     $('#realtimeDateNav').text(formattedDate);
//     $('#realtimeTimeNav').text(formattedTime);
//   }
// }

// Update waktu setiap detik - DISABLED
$(document).ready(function() {
  // Update immediately - DISABLED
  // updateRealtimeDateTime();
  
  // Update every second - DISABLED
  // setInterval(updateRealtimeDateTime, 1000);
  
  // ============================================
  // INTERACTIVE ENHANCEMENTS
  // ============================================
  
  // Add fade-in animation to cards
  $('.card').each(function(index) {
    $(this).css('opacity', '0').delay(index * 50).animate({
      opacity: 1
    }, 400);
  });
  
  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function(e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 70
      }, 600);
    }
  });
  
  // Table row click selection
  $('.table tbody tr').on('click', function() {
    $(this).siblings().removeClass('table-active');
    $(this).toggleClass('table-active');
  });
  
  // Form validation visual feedback
  $('.form-control, .custom-select').on('blur', function() {
    if ($(this).val()) {
      $(this).addClass('is-valid');
    } else {
      $(this).removeClass('is-valid');
    }
  });
  
  // Auto-dismiss alerts
  $('.alert').each(function() {
    if (!$(this).hasClass('alert-permanent')) {
      var $alert = $(this);
      setTimeout(function() {
        $alert.fadeOut(400, function() {
          $(this).remove();
        });
      }, 5000);
    }
  });
  
  // Prevent double-click on buttons (but not on links)
  $('.btn').on('click', function(e) {
    var $btn = $(this);
    // Don't prevent navigation for links
    if ($btn.is('a') && $btn.attr('href') && !$btn.attr('href').startsWith('javascript:')) {
      return true;
    }
    if ($btn.hasClass('processing')) {
      e.preventDefault();
      return false;
    }
    $btn.addClass('processing');
    setTimeout(function() {
      $btn.removeClass('processing');
    }, 1000);
  });
  
  // Ensure nav-links work properly
  $('.nav-link[href]').on('click', function(e) {
    // Only prevent if it's a dropdown toggle or javascript link
    if ($(this).attr('href') === 'javascript:;' || $(this).data('toggle') === 'dropdown') {
      return true;
    }
    // Allow normal navigation
    return true;
  });
  
  // Touch feedback for mobile
  if ('ontouchstart' in window) {
    $('.btn, .card, .nav-link').on('touchstart', function() {
      $(this).addClass('touch-active');
    }).on('touchend', function() {
      var $this = $(this);
      setTimeout(function() {
        $this.removeClass('touch-active');
      }, 200);
    });
  }
  
  // Navbar scroll effect
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('navbar-scrolled');
    } else {
      $('.navbar').removeClass('navbar-scrolled');
    }
  });
  
  // Loading overlay show/hide
  $(document).ajaxStart(function() {
    $('.loading-overlay').addClass('show');
  }).ajaxStop(function() {
    $('.loading-overlay').removeClass('show');
  });
});

