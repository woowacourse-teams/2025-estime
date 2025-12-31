package com.estime.shared;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import java.time.Instant;
import java.util.Objects;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import org.hibernate.Hibernate;
import org.hibernate.annotations.SQLRestriction;

@FieldNameConstants
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@MappedSuperclass
@Getter
@SQLRestriction("active = true")
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "active", nullable = false)
    protected boolean active = true;

    @Column(name = "created_at", nullable = false)
    protected Instant createdAt;

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }

    // 프록시 객체를 고려한 타입 비교 + id 비교
    @Override
    public final boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null) {
            return false;
        }
        // 프록시를 고려한 실제 타입 비교
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        final BaseEntity that = (BaseEntity) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        if (id == null) {
            throw new IllegalStateException("hashCode() called on entity without ID");
        }
        return Objects.hash(id);
    }
}
