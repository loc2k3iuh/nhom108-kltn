package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ColorResponse;
import iuh.fit.se.entities.Color;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-10T11:44:53+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class ColorMapperImpl implements ColorMapper {

    @Override
    public ColorResponse toColorResponse(Color color) {
        if ( color == null ) {
            return null;
        }

        ColorResponse.ColorResponseBuilder colorResponse = ColorResponse.builder();

        colorResponse.id( color.getId() );
        colorResponse.name( color.getName() );
        colorResponse.description( color.getDescription() );

        return colorResponse.build();
    }
}
