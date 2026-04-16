package com.zelixa.zelixa.service;

import com.zelixa.zelixa.dto.AddressRequest;
import com.zelixa.zelixa.dto.AddressResponse;
import com.zelixa.zelixa.entity.Address;
import com.zelixa.zelixa.repository.AddressRepository;
import com.zelixa.zelixa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getUserAddresses(String email) {
        Long userId = getUserIdByEmail(email);
        return addressRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(String email, AddressRequest request) {
        Long userId = getUserIdByEmail(email);
        
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetOtherDefaults(userId);
        }

        // If it's the first address, make it default
        boolean isFirst = addressRepository.findByUserId(userId).isEmpty();
        boolean isDefault = isFirst || Boolean.TRUE.equals(request.getIsDefault());

        Address address = Address.builder()
                .userId(userId)
                .label(request.getLabel())
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .provinceId(request.getProvinceId())
                .provinceName(request.getProvinceName())
                .cityId(request.getCityId())
                .cityName(request.getCityName())
                .districtId(request.getDistrictId())
                .districtName(request.getDistrictName())
                .subdistrictId(request.getSubdistrictId())
                .subdistrictName(request.getSubdistrictName())
                .addressLine(request.getAddressLine())
                .postalCode(request.getPostalCode())
                .isDefault(isDefault)
                .build();

        return mapToResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(String email, Long id, AddressRequest request) {
        Long userId = getUserIdByEmail(email);
        Address address = addressRepository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault()) && !address.getIsDefault()) {
            unsetOtherDefaults(userId);
            address.setIsDefault(true);
        }

        address.setLabel(request.getLabel());
        address.setRecipientName(request.getRecipientName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setProvinceId(request.getProvinceId());
        address.setProvinceName(request.getProvinceName());
        address.setCityId(request.getCityId());
        address.setCityName(request.getCityName());
        address.setDistrictId(request.getDistrictId());
        address.setDistrictName(request.getDistrictName());
        address.setSubdistrictId(request.getSubdistrictId());
        address.setSubdistrictName(request.getSubdistrictName());
        address.setAddressLine(request.getAddressLine());
        address.setPostalCode(request.getPostalCode());

        return mapToResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        Long userId = getUserIdByEmail(email);
        Address address = addressRepository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepository.delete(address);

        // If we deleted the default, set another one as default if exists
        if (address.getIsDefault()) {
            addressRepository.findByUserId(userId).stream()
                    .findFirst()
                    .ifPresent(a -> {
                        a.setIsDefault(true);
                        addressRepository.save(a);
                    });
        }
    }

    @Transactional
    public AddressResponse setDefaultAddress(String email, Long id) {
        Long userId = getUserIdByEmail(email);
        Address address = addressRepository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Address not found"));

        unsetOtherDefaults(userId);
        address.setIsDefault(true);
        return mapToResponse(addressRepository.save(address));
    }

    private void unsetOtherDefaults(Long userId) {
        addressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(a -> {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                });
    }

    private Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                .provinceId(address.getProvinceId())
                .provinceName(address.getProvinceName())
                .cityId(address.getCityId())
                .cityName(address.getCityName())
                .districtId(address.getDistrictId())
                .districtName(address.getDistrictName())
                .subdistrictId(address.getSubdistrictId())
                .subdistrictName(address.getSubdistrictName())
                .addressLine(address.getAddressLine())
                .postalCode(address.getPostalCode())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}
