package com.shekza.shekza.service;

import com.shekza.shekza.entity.Voucher;
import com.shekza.shekza.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    
    public Page<Voucher> getAllVouchers(Pageable pageable) {
        return voucherRepository.findAll(pageable);
    }

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Voucher getVoucherById(Long id) {
        return voucherRepository.findById(id).orElseThrow(() -> new RuntimeException("Voucher not found"));
    }

    public Voucher getVoucherByCode(String code) {
        return voucherRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Voucher not found"));
    }

    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    public Voucher updateVoucher(Long id, Voucher voucherDetails) {
        Voucher voucher = getVoucherById(id);
        voucher.setCode(voucherDetails.getCode());
        voucher.setDiscountAmount(voucherDetails.getDiscountAmount());
        voucher.setMinPurchase(voucherDetails.getMinPurchase());
        voucher.setValidUntil(voucherDetails.getValidUntil());
        voucher.setIsActive(voucherDetails.getIsActive());
        return voucherRepository.save(voucher);
    }

    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }
}
