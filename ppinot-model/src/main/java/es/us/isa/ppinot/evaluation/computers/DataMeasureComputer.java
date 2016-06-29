package es.us.isa.ppinot.evaluation.computers;

import es.us.isa.ppinot.evaluation.MeasureInstance;
import es.us.isa.ppinot.evaluation.logs.LogEntry;
import es.us.isa.ppinot.evaluation.matchers.Matcher;
import es.us.isa.ppinot.evaluation.matchers.MatcherFactory;
import es.us.isa.ppinot.model.MeasureDefinition;
import es.us.isa.ppinot.model.base.DataMeasure;
import org.mvel2.MVEL;

import java.io.Serializable;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DataMeasureComputer
 * Copyright (C) 2015 Universidad de Sevilla
 *
 * @author resinas
 */
public class DataMeasureComputer extends AbstractBaseMeasureComputer<DataMeasure> implements MeasureComputer {

    private static final Logger log = Logger.getLogger(DataMeasureComputer.class.getName());

    private Matcher precondition = null;
    private Serializable selectionExpression;
    private boolean onlyFirst = false;

    public DataMeasureComputer(MeasureDefinition definition) {
        super(definition);

        if (this.definition.getPrecondition() != null) {
            precondition = new MatcherFactory().create(this.definition.getPrecondition());
        }

        if (this.definition.isFirst()) {
            onlyFirst = true;
        }

        selectionExpression = MVEL.compileExpression(this.definition.getDataContentSelection().getSelection());
    }

    @Override
    public void update(LogEntry entry) {

        if (precondition(entry)) {
            try {
                Map<String, Object> data = entry.getData();
                data.put("##timestamp", entry.getTimeStamp());
                Object value = MVEL.executeExpression(selectionExpression, data);
                MeasureInstance m = getMeasure(entry);
                if (m == null || ! onlyFirst) {
                    m = getOrCreateMeasure(entry, null);
                    m.setValue(value);
                }

            } catch (Exception e) {
                log.log(Level.INFO, "Expression evaluation failed: " + this.definition.getDataContentSelection().getSelection(), e);
            }
        }

    }

    private boolean precondition(LogEntry entry) {
        boolean condition;

        if (precondition == null) {
            condition = true;
        } else {
            condition = precondition.matches(entry);
        }

        return condition;
    }
}
