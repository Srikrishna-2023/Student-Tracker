$(document).ready(function () {
  // Confirm before delete
$(document).on('submit', '.delete-form', function(e) {
  if (!confirm('Are you sure you want to delete this result?')) {
    e.preventDefault();
  }
});

  // ── Form Validation ─────────────────────────────────────────
  $('#resultForm').on('submit', function (e) {
    let valid = true;

    // Clear previous errors
    $('.form-control').removeClass('is-invalid');
    $('.invalid-feedback').text('');

    const studentId = $('#student_id').val().trim();
    const name = $('#name').val().trim();
    const subject = $('#subject').val().trim();
    const marks = $('#marks').val().trim();
    const total = $('#total').val().trim();

    // Student ID validation
    if (!studentId) {
      showError('#student_id', 'Student ID is required.');
      valid = false;
    } else if (!/^[A-Za-z0-9\-]+$/.test(studentId)) {
      showError('#student_id', 'Student ID can only contain letters, numbers, and hyphens.');
      valid = false;
    }

    // Name validation
    if (!name) {
      showError('#name', 'Student name is required.');
      valid = false;
    } else if (name.length < 2) {
      showError('#name', 'Name must be at least 2 characters.');
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      showError('#name', 'Name can only contain letters and spaces.');
      valid = false;
    }

    // Subject validation
    if (!subject) {
      showError('#subject', 'Subject is required.');
      valid = false;
    }

    // Marks validation
    if (!marks) {
      showError('#marks', 'Marks are required.');
      valid = false;
    } else if (isNaN(marks) || parseInt(marks) < 0) {
      showError('#marks', 'Marks must be a positive number.');
      valid = false;
    }

    // Total marks validation
    if (!total) {
      showError('#total', 'Total marks are required.');
      valid = false;
    } else if (isNaN(total) || parseInt(total) <= 0) {
      showError('#total', 'Total marks must be greater than 0.');
      valid = false;
    }

    // Marks vs total validation
    if (marks && total && !isNaN(marks) && !isNaN(total)) {
      if (parseInt(marks) > parseInt(total)) {
        showError('#marks', 'Marks cannot exceed total marks.');
        valid = false;
      }
    }

    if (!valid) {
      e.preventDefault();
      // Scroll to first error
      $('html, body').animate({
        scrollTop: $('.is-invalid').first().offset().top - 100
      }, 300);
    } else {
      // Show loading state on button
      $('#submitBtn').html(
        '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...'
      ).prop('disabled', true);
    }
  });

  function showError(field, message) {
    $(field).addClass('is-invalid');
    $(field).siblings('.invalid-feedback').text(message);
  }

  // ── Live percentage preview ──────────────────────────────────
  function updatePreview() {
    const marks = parseInt($('#marks').val());
    const total = parseInt($('#total').val());

    if (!isNaN(marks) && !isNaN(total) && total > 0 && marks <= total) {
      const pct = ((marks / total) * 100).toFixed(1);
      const grade = getGrade(pct);
      const status = pct >= 50 ? 'Pass' : 'Fail';
      const statusClass = pct >= 50 ? 'text-success' : 'text-danger';

      $('#previewBox').removeClass('d-none').html(`
        <div class="d-flex align-items-center gap-3">
          <div>
            <div class="fw-bold fs-5">${pct}%</div>
            <div class="small text-muted">Percentage</div>
          </div>
          <div>
            <div class="fw-bold fs-5">${grade}</div>
            <div class="small text-muted">Grade</div>
          </div>
          <div>
            <div class="fw-bold fs-5 ${statusClass}">${status}</div>
            <div class="small text-muted">Status</div>
          </div>
        </div>
      `);
    } else {
      $('#previewBox').addClass('d-none');
    }
  }

  function getGrade(pct) {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  }

  $('#marks, #total').on('input', updatePreview);

  // ── Search live filter ────────────────────────────────────────
  $('#searchInput').on('input', function () {
    const query = $(this).val().toLowerCase();
    let visibleCount = 0;

    $('#resultsTable tbody tr').each(function () {
      const text = $(this).text().toLowerCase();
      if (text.includes(query)) {
        $(this).show();
        visibleCount++;
      } else {
        $(this).hide();
      }
    });

    // Show/hide empty state
    if (visibleCount === 0) {
      $('#noResults').removeClass('d-none');
    } else {
      $('#noResults').addClass('d-none');
    }
  });

  // ── Auto dismiss alerts ───────────────────────────────────────
  setTimeout(function () {
    $('.alert').fadeOut(500);
  }, 4000);

  // ── Animate marks bars on load ────────────────────────────────
  $('.marks-bar-fill').each(function () {
    const width = $(this).data('width');
    $(this).css('width', 0).animate({ width: width + '%' }, 800);
  });

  // ── Confirmation on reset ─────────────────────────────────────
  $('#resetBtn').on('click', function (e) {
    if ($('#resultForm')[0].checkValidity() === false) return;
    if (!confirm('Are you sure you want to reset the form?')) {
      e.preventDefault();
    }
  });

});
