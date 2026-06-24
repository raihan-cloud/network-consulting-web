export type ServiceItem = {
  slug: string;
  number: string;
  title: string;
  shortDesc: string;
  description: string;
  points: string[];
  suitableFor: string[];
  technologies: string[];
};

export const services: ServiceItem[] = [
  {
    slug: "network-infrastructure",
    number: "01",
    title: "Network Infrastructure",
    shortDesc:
      "Instalasi LAN, WAN, wireless, VLAN, dan monitoring untuk kebutuhan bisnis.",
    description:
      "Layanan perancangan dan implementasi jaringan kantor, sekolah, kampus, instansi, dan perusahaan agar lebih stabil, aman, dan mudah dikembangkan.",
    points: [
      "Instalasi jaringan LAN/WAN",
      "Desain topologi jaringan",
      "Konfigurasi VLAN",
      "Access point dan wireless coverage",
      "Network monitoring",
    ],
    suitableFor: ["Kantor", "Sekolah", "Kampus", "Instansi", "UMKM"],
    technologies: ["MikroTik", "Cisco", "Ubiquiti", "TP-Link Omada"],
  },
  {
    slug: "fiber-optic",
    number: "02",
    title: "Fiber Optic Deployment",
    shortDesc:
      "Pemasangan backbone fiber optik, splicing, ODF, dan pengujian jaringan.",
    description:
      "Layanan implementasi fiber optik untuk koneksi antar gedung, backbone jaringan, dan kebutuhan koneksi jarak jauh yang stabil.",
    points: [
      "Penarikan kabel fiber optik",
      "Splicing fiber optik",
      "Terminasi ODF",
      "Testing koneksi",
      "Troubleshooting fiber",
    ],
    suitableFor: ["Gedung", "Sekolah", "Kampus", "Kantor", "Area industri"],
    technologies: ["ODF", "OTDR", "Media Converter", "SFP Module"],
  },
  {
    slug: "mikrotik",
    number: "03",
    title: "MikroTik & Routing",
    shortDesc:
      "Konfigurasi MikroTik untuk hotspot, firewall, VPN, routing, dan bandwidth.",
    description:
      "Layanan konfigurasi router MikroTik untuk mengatur koneksi internet, keamanan jaringan, manajemen user, hotspot, dan bandwidth.",
    points: [
      "Hotspot user management",
      "Firewall security",
      "Bandwidth management",
      "VPN remote access",
      "Load balancing",
    ],
    suitableFor: ["Kantor", "Cafe", "Sekolah", "Kampus", "RT/RW Net"],
    technologies: ["MikroTik RouterOS", "Winbox", "The Dude", "CAPsMAN"],
  },
  {
    slug: "cctv",
    number: "04",
    title: "Security & CCTV",
    shortDesc:
      "Instalasi CCTV, IP Camera, NVR, remote monitoring, dan integrasi jaringan.",
    description:
      "Layanan pemasangan sistem keamanan berbasis kamera pengawas yang dapat dipantau secara lokal maupun remote.",
    points: [
      "Instalasi IP Camera",
      "Konfigurasi NVR",
      "Remote monitoring",
      "Integrasi jaringan CCTV",
      "Maintenance kamera",
    ],
    suitableFor: ["Rumah", "Kantor", "Toko", "Gudang", "Sekolah"],
    technologies: ["IP Camera", "NVR", "PoE Switch", "Cloud CCTV"],
  },
  {
    slug: "server",
    number: "05",
    title: "Server & Virtualization",
    shortDesc:
      "Implementasi server, Proxmox, NAS, backup, dan private cloud.",
    description:
      "Layanan pembuatan server internal untuk kebutuhan file sharing, backup, virtualisasi, aplikasi, dan private cloud.",
    points: [
      "Instalasi Proxmox",
      "File server dan NAS",
      "Backup server",
      "Virtual machine",
      "Private cloud",
    ],
    suitableFor: ["Perusahaan", "Kampus", "Sekolah", "Lab komputer", "Instansi"],
    technologies: ["Proxmox", "Linux Server", "TrueNAS", "VMware"],
  },
  {
    slug: "consultation",
    number: "06",
    title: "IT Consultation",
    shortDesc:
      "Konsultasi desain jaringan, audit infrastruktur, upgrade, dan dokumentasi.",
    description:
      "Layanan konsultasi untuk membantu menentukan desain jaringan, kebutuhan perangkat, estimasi biaya, dan rencana pengembangan infrastruktur IT.",
    points: [
      "Audit jaringan",
      "Desain topologi",
      "Rekomendasi perangkat",
      "Dokumentasi teknis",
      "Rencana maintenance",
    ],
    suitableFor: ["Bisnis baru", "Kantor berkembang", "Sekolah", "Instansi"],
    technologies: ["Network Design", "Security Review", "IT Planning"],
  },
];