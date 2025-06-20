export default {
  async afterCreate(event) {
    const { result } = event;

    const dataDraft = await strapi
      .documents("api::transaksi.transaksi")
      .findOne({
        documentId: result.documentId,
        populate: {
          pelanggan: true,
        },
      });

    // Siapkan parameter untuk EmailJS
    const templateParams = {
      pelanggan_nama: dataDraft.pelanggan.nama,
      email: dataDraft.pelanggan.email,
      no_transaksi: dataDraft.documentId,
      tanggal: new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
    };

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: process.env.SERVICE_ID,
            template_id: "template_yoahzhp",
            user_id: process.env.PUBLIC_KEY,
            accessToken: process.env.PRIVATE_KEY,
            template_params: templateParams,
          }),
        }
      );

      if (response.ok) {
        console.log("Email buat transaksi berhasil dikirim via EmailJS.");
      } else {
        const errorText = await response.text();
        console.error(
          "Gagal mengirim email via EmailJS:",
          response.status,
          errorText
        );
      }
    } catch (error) {
      console.error("Gagal mengirim email via EmailJS:", error);
    }
  },

  async beforeUpdate(event) {
    const { where } = event.params;

    const oldData = await strapi.entityService.findOne(
      "api::transaksi.transaksi",
      where.id
    );

    event.state = {
      previousStatusPengerjaan: oldData?.status_pengerjaan,
      previousStatusPembayaran: oldData?.status_pembayaran,
    };
  },

  async afterUpdate(event) {
    const { result } = event;

    const previousStatusPengerjaan = event.state.previousStatusPengerjaan;
    const previousStatusPembayaran = event.state.previousStatusPembayaran;

    const dataWithPelanggan = await strapi
      .documents("api::transaksi.transaksi")
      .findOne({
        documentId: result.documentId,
        populate: {
          pelanggan: true,
        },
      });

    const isPengerjaanSelesai =
      result.status_pengerjaan !== previousStatusPengerjaan;
    const isPembayaranLunas =
      result.status_pembayaran !== previousStatusPembayaran;

    if (isPengerjaanSelesai && result.status_pengerjaan === "Selesai") {
      const templateParams = {
        pelanggan_nama: dataWithPelanggan.pelanggan.nama,
        email: dataWithPelanggan.pelanggan.email,
        no_transaksi: result.documentId,
        subject:"✨ Pesanan Anda Telah Selesai - Ms. Puff Laundry",
        information_title: "Pesanan Anda Telah Selesai!",
        information_description: "Kami senang memberitahukan bahwa pesanan Anda telah selesai diproses.",
        status: "<p>Status : <strong>Selesai</strong></p>",
        closing: "Silahkan ambil pesanan Anda di toko kami."
      };

      try {
        const response = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: process.env.SERVICE_ID,
              template_id: "template_l40kspd",
              user_id: process.env.PUBLIC_KEY,
              accessToken: process.env.PRIVATE_KEY,
              template_params: templateParams,
            }),
          }
        );

        if (response.ok) {
          console.log("Email Status Selesai Terbuat via EmailJS.");
        } else {
          const errorText = await response.text();
          console.error(
            "Gagal mengirim email via EmailJS:",
            response.status,
            errorText
          );
        }
      } catch (error) {
        console.error("Gagal mengirim email via EmailJS:", error);
      }
    }

    if (isPembayaranLunas && result.status_pembayaran === "Sudah Bayar") {
      const templateParams = {
        pelanggan_nama: dataWithPelanggan.pelanggan.nama,
        email: dataWithPelanggan.pelanggan.email,
        no_transaksi: result.documentId,
        subject:"💰 Pembayaran Berhasil - Ms. Puff Laundry",
        information_title: "Pembayaran Telah Diterima!",
        information_description: "Terima kasih! Pembayaran Anda telah kami terima dengan baik.",
        status: "<p>Status Pembayaran : <strong>Lunas</strong></p>",
        closing: "Kami sangat menghargai kepercayaan Anda menggunakan jasa Ms. Puff Laundry."
      };

      try {
        const response = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: process.env.SERVICE_ID,
              template_id: "template_l40kspd",
              user_id: process.env.PUBLIC_KEY,
              accessToken: process.env.PRIVATE_KEY,
              template_params: templateParams,
            }),
          }
        );

        if (response.ok) {
          console.log("Email Status Pembayaran Selesai Terbuat via EmailJS.");
        } else {
          const errorText = await response.text();
          console.error(
            "Gagal mengirim email via EmailJS:",
            response.status,
            errorText
          );
        }
      } catch (error) {
        console.error("Gagal mengirim email via EmailJS:", error);
      }
    }
  },
};
