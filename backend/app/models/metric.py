from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id: Mapped[int] = mapped_column(primary_key=True)

    site_id: Mapped[int] = mapped_column(
        ForeignKey("sites.id"),
        nullable=False,
        index=True,
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    carbon_sequestered: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    carbon_avoided: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    biodiversity_score: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
    )

    habitat_area: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    site: Mapped["Site"] = relationship(
        back_populates="metrics"
    )