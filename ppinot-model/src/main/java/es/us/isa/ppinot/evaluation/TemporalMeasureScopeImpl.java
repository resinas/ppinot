package es.us.isa.ppinot.evaluation;

import org.joda.time.DateTime;

import java.util.Collection;

/**
 * TemporalMeasureScope
 * Copyright (C) 2013 Universidad de Sevilla
 *
 * @author resinas
 */
public class TemporalMeasureScopeImpl extends MeasureScopeImpl implements TemporalMeasureScope {
    private DateTime start;
    private DateTime end;

    public TemporalMeasureScopeImpl(String processId, DateTime start, DateTime end) {
        super(processId);
        this.start = start;
        this.end = end;
    }

    public TemporalMeasureScopeImpl(String processId, Collection<String> instances, DateTime start, DateTime end) {
        super(processId, instances);
        this.start = start;
        this.end = end;
    }

    @Override
    public DateTime getStart() {
        return start;
    }

    @Override
    public DateTime getEnd() {
        return end;
    }
}
